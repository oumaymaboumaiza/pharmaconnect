const db = require("../db");
const bcrypt = require("bcryptjs"); // ✅ CORRECTION: bcryptjs au lieu de bcrypt

// Helper function to validate pharmacy data
const validatePharmacyData = (data) => {
  const { nom_pharmacie, email, telephone, password, president_pharmacie } =
    data; // ✅ CORRECTION: password au lieu de mot_de_passe

  if (
    !nom_pharmacie ||
    !email ||
    !telephone ||
    !password ||
    !president_pharmacie
  ) {
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

  return { isValid: true };
};

// ➕ Ajouter une pharmacie
exports.addPharmacy = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Validate input data
    const validation = validatePharmacyData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const { nom_pharmacie, email, telephone, password, president_pharmacie } =
      req.body; // ✅ CORRECTION: password au lieu de mot_de_passe

    // Check for existing pharmacy with same email
    const [existingPharmacy] = await connection.execute(
      "SELECT id_pharmacie FROM pharmacie WHERE email = ?",
      [email],
    );

    if (existingPharmacy.length > 0) {
      return res
        .status(400)
        .json({ error: "Une pharmacie avec cet email existe déjà" });
    }

    // Check for existing user with same email
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Un compte utilisateur avec cet email existe déjà" });
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

    // Create pharmacist user account
    const [userResult] = await connection.execute(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, "pharmacist"],
    );

    // Create pharmacy record (sans created_at si la colonne n'existe pas)
    const [pharmacyResult] = await connection.execute(
      `INSERT INTO pharmacie (nom_pharmacie, email, telephone, mot_de_passe, president_pharmacie, statut)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [nom_pharmacie, email, telephone, hashedPassword, president_pharmacie],
    );

    // Get the newly created pharmacy
    const [newPharmacy] = await connection.execute(
      `SELECT id_pharmacie, nom_pharmacie, email, telephone, president_pharmacie, statut
       FROM pharmacie WHERE id_pharmacie = ?`,
      [pharmacyResult.insertId],
    );

    await connection.commit();

    res.status(201).json({
      message: "Pharmacie et compte pharmacien créés avec succès",
      pharmacy: newPharmacy[0],
      user: {
        id: userResult.insertId,
        email: email,
        role: "pharmacist",
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error in addPharmacy:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la création",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// 📅 Liste de toutes les pharmacies
exports.getAllPharmacies = async (req, res) => {
  try {
    console.log("🔍 Récupération des pharmacies...");
    const [rows] = await db.execute(
      `SELECT id_pharmacie, nom_pharmacie, email, telephone, president_pharmacie, statut
       FROM pharmacie
       ORDER BY id_pharmacie DESC`,
    );
    console.log("✅ Pharmacies récupérées:", rows.length);
    // Return array directly for frontend compatibility
    res.json(rows);
  } catch (error) {
    console.error("❌ Error getting all pharmacies:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des pharmacies",
      details: error.message,
    });
  }
};

// ❌ Supprimer une pharmacie
exports.deletePharmacy = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Check if pharmacy exists and get email
    const [pharmacy] = await connection.execute(
      "SELECT id_pharmacie, email FROM pharmacie WHERE id_pharmacie = ?",
      [id],
    );

    if (pharmacy.length === 0) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }

    const email = pharmacy[0].email;

    // Delete pharmacy
    await connection.execute("DELETE FROM pharmacie WHERE id_pharmacie = ?", [
      id,
    ]);

    // Delete associated user account
    await connection.execute("DELETE FROM users WHERE email = ? AND role = ?", [
      email,
      "pharmacist",
    ]);

    await connection.commit();

    res.json({
      message: "Pharmacie et compte utilisateur supprimés avec succès",
      deleted_pharmacy_id: id,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting pharmacy:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// 🚫 Toggle Pharmacy Status (Activer/Désactiver)
exports.togglePharmacyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // Validate input
    if (typeof active !== "boolean") {
      return res
        .status(400)
        .json({ error: "Le statut actif doit être true ou false" });
    }

    // Check if pharmacy exists
    const [pharmacy] = await db.execute(
      "SELECT id_pharmacie, statut FROM pharmacie WHERE id_pharmacie = ?",
      [id],
    );

    if (pharmacy.length === 0) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }

    // Update status using 'active' or 'inactive' values
    const newStatus = active ? "active" : "inactive";
    await db.execute(
      "UPDATE pharmacie SET statut = ? WHERE id_pharmacie = ?",
      [newStatus, id],
    );

    res.json({
      message: `Pharmacie ${active ? "activée" : "désactivée"} avec succès`,
      pharmacy_id: id,
      new_status: newStatus,
    });
  } catch (error) {
    console.error("Error toggling pharmacy status:", error);
    res.status(500).json({
      error: "Erreur lors du changement de statut",
      details: error.message,
    });
  }
};

// 🔍 Détails d'une pharmacie
exports.getPharmacyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      `SELECT p.id_pharmacie, p.nom_pharmacie, p.email, p.telephone, p.president_pharmacie,
              p.statut, u.id as user_id
       FROM pharmacie p
       LEFT JOIN users u ON p.email = u.email AND u.role = 'pharmacist'
       WHERE p.id_pharmacie = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }

    res.json({
      success: true,
      pharmacy: rows[0],
    });
  } catch (error) {
    console.error("Error getting pharmacy details:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des détails",
      details: error.message,
    });
  }
};

// ===== ADMIN PROFILE MANAGEMENT =====

// GET admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT id, full_name, email, phone, address, created_at FROM admin WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }

    res.json({
      success: true,
      admin: rows[0],
    });
  } catch (error) {
    console.error("Error getting admin profile:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération du profil",
      details: error.message,
    });
  }
};

// PUT update admin profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, address } = req.body;

    // Basic validation
    if (!full_name || !email) {
      return res
        .status(400)
        .json({ error: "Le nom complet et l'email sont obligatoires" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    // Check if admin exists
    const [adminExists] = await db.execute(
      "SELECT id FROM admin WHERE id = ?",
      [id],
    );
    if (adminExists.length === 0) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }

    // Update profile
    await db.execute(
      "UPDATE admin SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [full_name, email, phone || null, address || null, id],
    );

    res.json({
      message: "Profil mis à jour avec succès",
      updated_admin_id: id,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour du profil",
      details: error.message,
    });
  }
};

// PUT change admin password
exports.changeAdminPassword = async (req, res) => {
  try {
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

    // Get admin data
    const [rows] = await db.execute(
      "SELECT mot_de_passe FROM admin WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(old_password, rows[0].mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await db.execute("UPDATE admin SET mot_de_passe = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);

    res.json({
      message: "Mot de passe mis à jour avec succès",
      admin_id: id,
    });
  } catch (error) {
    console.error("Error changing admin password:", error);
    res.status(500).json({
      error: "Erreur lors du changement de mot de passe",
      details: error.message,
    });
  }
};

// ===== PLACEHOLDER FUNCTIONS (À REDIRIGER VERS LES CONTRÔLEURS SPÉCIFIQUES) =====

// Doctors - Ces fonctions devraient utiliser doctorController
exports.addDoctor = async (req, res) => {
  res.status(501).json({
    error: "Utilisez doctorController.createDoctor",
    message: "Cette fonction a été déplacée vers doctorController",
  });
};

exports.deleteDoctor = async (req, res) => {
  res.status(501).json({
    error: "Utilisez doctorController.deleteDoctor",
    message: "Cette fonction a été déplacée vers doctorController",
  });
};

exports.deactivateDoctor = async (req, res) => {
  res.status(501).json({
    error: "Utilisez doctorController.toggleDoctorStatus",
    message: "Cette fonction a été déplacée vers doctorController",
  });
};

exports.getDoctorDetails = async (req, res) => {
  res.status(501).json({
    error: "Utilisez doctorController.getProfile",
    message: "Cette fonction a été déplacée vers doctorController",
  });
};

// Suppliers - Ces fonctions devraient utiliser supplierController
exports.deleteSupplier = async (req, res) => {
  res.status(501).json({
    error: "Utilisez supplierController.deleteSupplier",
    message: "Cette fonction a été déplacée vers supplierController",
  });
};

exports.activateSupplier = async (req, res) => {
  res.status(501).json({
    error: "Utilisez supplierController.toggleStatus",
    message: "Cette fonction a été déplacée vers supplierController",
  });
};

exports.deactivateSupplier = async (req, res) => {
  res.status(501).json({
    error: "Utilisez supplierController.toggleStatus",
    message: "Cette fonction a été déplacée vers supplierController",
  });
};

exports.getSupplierDetails = async (req, res) => {
  res.status(501).json({
    error: "Utilisez supplierController.getSupplier",
    message: "Cette fonction a été déplacée vers supplierController",
  });
};
