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
const createSupplier = async (req, res) => {
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
const getAllSuppliers = async (req, res) => {
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
const getSupplier = async (req, res) => {
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
const updateSupplier = async (req, res) => {
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
const toggleStatus = async (req, res) => {
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
const deleteSupplier = async (req, res) => {
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
const changePassword = async (req, res) => {
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
const getSuppliersByStatus = async (req, res) => {
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

// Nouvelle fonction pour récupérer les pharmacies partenaires d'un fournisseur
const getSupplierPharmacies = async (req, res) => {
  const supplierId = req.params.id;

  try {
    const [pharmacies] = await db.execute(
      `SELECT
         p.id_pharmacie AS pharmacy_id,
         p.nom_pharmacie,
         p.email AS pharmacy_email,
         p.telephone AS pharmacy_phone,
         p.president_pharmacie
       FROM
         pharmacie p
       JOIN
         supplier_pharmacie sp ON p.id_pharmacie = sp.pharmacie_id
       WHERE
         sp.supplier_id = ?`,
      [supplierId]
    );

    if (pharmacies.length === 0) {
      return res.status(404).json({ message: "Aucune pharmacie partenaire trouvée pour ce fournisseur." });
    }

    res.status(200).json({ success: true, pharmacies });

  } catch (error) {
    console.error("Erreur lors de la récupération des pharmacies partenaires:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des pharmacies partenaires." });
  }
};
const addPharmacyToSupplier = async (req, res) => {
  const { supplierId, pharmacyId } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      "SELECT * FROM supplier_pharmacie WHERE supplier_id = ? AND pharmacie_id = ?",
      [supplierId, pharmacyId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Relation déjà existante." });
    }

    await connection.execute(
      "INSERT INTO supplier_pharmacie (supplier_id, pharmacie_id) VALUES (?, ?)",
      [supplierId, pharmacyId]
    );

    await connection.commit();
    res.status(201).json({ message: "Relation créée avec succès" });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur ajout relation :", error);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    connection.release();
  }
};

const getPharmaciesBySupplier = async (req, res) => {
  const supplierId = req.params.id;

  try {
    const [pharmacies] = await db.execute(`
      SELECT 
        p.id AS pharmacy_id,
        p.nom AS nom_pharmacie,
        p.email AS pharmacy_email,
        p.telephone AS pharmacy_phone,
        p.president AS president_pharmacie
      FROM pharmacies p
      JOIN supplier_pharmacie sp ON p.id = sp.id_pharmacie
      WHERE sp.id_supplier = ?
    `, [supplierId]);

    // 🔁 Pour chaque pharmacie, récupérer les médicaments demandés
    for (let pharmacy of pharmacies) {
      const [medicaments] = await db.execute(`
        SELECT nom, quantite FROM medicaments_stock WHERE id_pharmacy = ?
      `, [pharmacy.pharmacy_id]);

      pharmacy.medicaments_demandes = medicaments;
    }

    res.json({ success: true, pharmacies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

const getPharmaciesWithDemandes = async (req, res) => {
  const supplierId = req.params.supplierId;

  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id AS pharmacy_id,
        p.nom AS nom_pharmacie,
        p.email AS pharmacy_email,
        p.telephone AS pharmacy_phone,
        p.president AS president_pharmacie,
        m.nom AS nom_medicament,
        d.quantite
      FROM pharmacies p
      JOIN demandes d ON p.id = d.pharmacy_id
      JOIN medicaments_stock m ON d.medicament_id = m.id
      WHERE d.supplier_id = ?
    `, [supplierId]);

    // Regrouper par pharmacie
    const grouped = {};

    rows.forEach(row => {
      if (!grouped[row.pharmacy_id]) {
        grouped[row.pharmacy_id] = {
          pharmacy_id: row.pharmacy_id,
          nom_pharmacie: row.nom_pharmacie,
          pharmacy_email: row.pharmacy_email,
          pharmacy_phone: row.pharmacy_phone,
          president_pharmacie: row.president_pharmacie,
          medicaments_demandes: [],
        };
      }

      if (row.nom_medicament) {
        grouped[row.pharmacy_id].medicaments_demandes.push({
          nom: row.nom_medicament,
          quantite: row.quantite,
        });
      }
    });

    res.json({ success: true, pharmacies: Object.values(grouped) });

  } catch (error) {
    console.error("Erreur SQL :", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

const getPharmaciesBySupplierId = async (req, res) => {
  const supplierId = req.params.id;
  try {
    const [pharmacies] = await db.execute(
      `SELECT p.id_pharmacie, p.nom, p.telephone, p.president
       FROM supplier_pharmacie sp
       JOIN pharmacie p ON sp.pharmacie_id = p.id_pharmacie
       WHERE sp.supplier_id = ?`,
      [supplierId]
    );

    res.status(200).json({ success: true, pharmacies });
  } catch (error) {
    console.error("Erreur récupération pharmacies :", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};



module.exports = {
  createSupplier,
  getAllSuppliers ,
  getSupplier ,
  updateSupplier ,
  toggleStatus ,
  deleteSupplier ,
  changePassword ,
  getSuppliersByStatus ,
  getSupplierPharmacies ,
  addPharmacyToSupplier ,
  getPharmaciesBySupplier,
  getPharmaciesBySupplierId,
  getPharmaciesWithDemandes, // Nouvelle fonction exportée
};
