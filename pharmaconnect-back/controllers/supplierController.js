const db = require("../db");
const bcrypt = require("bcryptjs"); // ✅ CORRECTION: bcryptjs au lieu de bcrypt
const { createAndSaveUser } = require("./userController");

// Helper function to validate supplier data
const validateSupplierData = (data) => {
  const { nom, prenom, email, password, telephone } = data;

  if (!nom || !prenom || !email || !password || !telephone) {
    return { isValid: false, error: "Tous les champs sont obligatoires" };
  }

  if (typeof password !== "string" || password.trim() === "") {
    return { isValid: false, error: "Le mot de passe ne peut pas être vide" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Le mot de passe doit contenir au moins 6 caractères",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Format d'email invalide" };
  }

  const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
  if (!phoneRegex.test(telephone)) {
    return { isValid: false, error: "Format de téléphone invalide" };
  }

  return { isValid: true };
};

// Create new supplier
exports.createSupplier = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Validate input data
    const validation = validateSupplierData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const { nom, prenom, email, password, telephone } = req.body;

    // Check for existing supplier with same email
    const [existing] = await connection.execute(
      "SELECT id FROM suppliers WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Un fournisseur avec cet email existe déjà" });
    }

    // Create user account first
    try {
      await createAndSaveUser(email, password, "supplier");
    } catch (userCreationError) {
      console.error(
        "Error creating user account for supplier:",
        userCreationError,
      );
      if (userCreationError.message.includes("already exists")) {
        return res
          .status(409)
          .json({ error: "Un compte avec cet email existe déjà" });
      }
      return res
        .status(500)
        .json({ error: "Erreur création du compte utilisateur" });
    }

    // Hash the password with error handling
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return res
        .status(500)
        .json({ error: "Erreur de sécurité lors du cryptage du mot de passe" });
    }

    // Create supplier record (sans created_at si la colonne n'existe pas)
    const [result] = await connection.execute(
      `INSERT INTO suppliers (nom, prenom, email, password, telephone, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [nom, prenom, email, hashedPassword, telephone],
    );

    // Get the newly created supplier
    const [newSupplier] = await connection.execute(
      `SELECT id, nom, prenom, email, telephone, is_active 
       FROM suppliers WHERE id = ?`,
      [result.insertId],
    );

    await connection.commit();

    res.status(201).json({
      message: "Fournisseur créé avec succès",
      supplier: newSupplier[0],
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating supplier:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la création",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// Get all suppliers - ✅ CORRECTION: Retourne un array directement
exports.getAllSuppliers = async (req, res) => {
  try {
    console.log("🔍 Récupération des suppliers...");
    const [suppliers] = await db.execute(
      `SELECT id, nom, prenom, email, telephone, is_active 
       FROM suppliers 
       ORDER BY id DESC`,
    );
    console.log("✅ Suppliers récupérés:", suppliers.length);

    // Return array directly for frontend compatibility
    res.json(suppliers);
  } catch (error) {
    console.error("❌ Error getting all suppliers:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des fournisseurs",
      details: error.message,
    });
  }
};

// Get single supplier
exports.getSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const [supplier] = await db.execute(
      `SELECT id, nom, prenom, email, telephone, is_active 
       FROM suppliers WHERE id = ?`,
      [id],
    );

    if (supplier.length === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    res.json({
      success: true,
      supplier: supplier[0],
    });
  } catch (error) {
    console.error("Error getting supplier:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération du fournisseur",
      details: error.message,
    });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { nom, prenom, email, telephone } = req.body;

    // Basic validation
    if (!nom || !prenom || !email || !telephone) {
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    // Check if supplier exists
    const [supplierExists] = await connection.execute(
      "SELECT id, email FROM suppliers WHERE id = ?",
      [id],
    );
    if (supplierExists.length === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    // Check if email exists for other suppliers
    const [existing] = await connection.execute(
      "SELECT id FROM suppliers WHERE email = ? AND id != ?",
      [email, id],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Email déjà utilisé par un autre fournisseur" });
    }

    const oldEmail = supplierExists[0].email;

    // Update supplier
    await connection.execute(
      "UPDATE suppliers SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?",
      [nom, prenom, email, telephone, id],
    );

    // Update user email if changed
    if (email && email !== oldEmail) {
      await connection.execute(
        "UPDATE users SET email = ? WHERE email = ? AND role = ?",
        [email, oldEmail, "supplier"],
      );
    }

    await connection.commit();

    res.json({
      message: "Fournisseur mis à jour avec succès",
      supplier_id: id,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating supplier:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// Toggle supplier status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // Validate input
    if (typeof active !== "boolean") {
      return res
        .status(400)
        .json({ error: "Le statut actif doit être true ou false" });
    }

    // Check if supplier exists
    const [current] = await db.execute(
      "SELECT is_active FROM suppliers WHERE id = ?",
      [id],
    );

    if (current.length === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    // Update status
    await db.execute("UPDATE suppliers SET is_active = ? WHERE id = ?", [
      active ? 1 : 0,
      id,
    ]);

    res.json({
      message: `Fournisseur ${active ? "activé" : "désactivé"} avec succès`,
      supplier_id: id,
      is_active: active ? 1 : 0,
    });
  } catch (error) {
    console.error("Error toggling supplier status:", error);
    res.status(500).json({
      error: "Erreur lors du changement de statut",
      details: error.message,
    });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Check if supplier exists and get email
    const [supplier] = await connection.execute(
      "SELECT id, email FROM suppliers WHERE id = ?",
      [id],
    );

    if (supplier.length === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    const email = supplier[0].email;

    // Delete supplier
    await connection.execute("DELETE FROM suppliers WHERE id = ?", [id]);

    // Delete associated user account
    await connection.execute("DELETE FROM users WHERE email = ? AND role = ?", [
      email,
      "supplier",
    ]);

    await connection.commit();

    res.json({
      message: "Fournisseur et compte utilisateur supprimés avec succès",
      deleted_supplier_id: id,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting supplier:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// Change supplier password
exports.changePassword = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { old_password, new_password } = req.body;

    // Validation
    if (!old_password || !new_password) {
      return res
        .status(400)
        .json({ error: "Ancien et nouveau mot de passe requis" });
    }

    if (old_password.trim() === "" || new_password.trim() === "") {
      return res
        .status(400)
        .json({ error: "Les mots de passe ne peuvent pas être vides" });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        error: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Get supplier data
    const [rows] = await connection.execute(
      "SELECT email, password FROM suppliers WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    // Verify old password
    const match = await bcrypt.compare(old_password, rows[0].password);
    if (!match) {
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update supplier password
    await connection.execute("UPDATE suppliers SET password = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);

    // Update user password
    await connection.execute(
      "UPDATE users SET password = ? WHERE email = ? AND role = ?",
      [hashedPassword, rows[0].email, "supplier"],
    );

    await connection.commit();

    res.json({
      message: "Mot de passe mis à jour avec succès",
      supplier_id: id,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error changing supplier password:", error);
    res.status(500).json({
      error: "Erreur lors du changement de mot de passe",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// Get suppliers by status - ✅ CORRECTION: Retourne un array directement
exports.getSuppliersByStatus = async (req, res) => {
  try {
    const { status } = req.params; // 'active' or 'inactive'
    const isActive = status === "active" ? 1 : 0;

    const [suppliers] = await db.execute(
      `SELECT id, nom, prenom, email, telephone, is_active 
       FROM suppliers 
       WHERE is_active = ? 
       ORDER BY id DESC`,
      [isActive],
    );

    // Return array directly for frontend compatibility
    res.json(suppliers);
  } catch (error) {
    console.error("Error getting suppliers by status:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des fournisseurs par statut",
      details: error.message,
    });
  }
};
