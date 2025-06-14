const db = require('../db');
const bcrypt = require('bcrypt');


// ➕ Ajouter une pharmacie
exports.addPharmacy = async (req, res) => {
  const { nom_pharmacie, email, telephone, mot_de_passe, president_pharmacie } = req.body;
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const [result] = await db.execute(
      `INSERT INTO pharmacie (nom_pharmacie, email, telephone, mot_de_passe, president_pharmacie)
       VALUES (?, ?, ?, ?, ?)`,
      [nom_pharmacie, email, telephone, hashedPassword, president_pharmacie] // Use hashed password here
    );
    res.status(201).json({ message: 'Pharmacie ajoutée', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📅 Liste de toutes les pharmacies
exports.getAllPharmacies = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pharmacie');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Supprimer une pharmacie
exports.deletePharmacy = async (req, res) => {
  try {
    await db.execute('DELETE FROM pharmacie WHERE id_pharmacie = ?', [req.params.id]);
    res.json({ message: 'Pharmacie supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🚫 Désactiver une pharmacie
exports.deactivatePharmacy = async (req, res) => {
  try {
    await db.execute('UPDATE pharmacie SET statut = ? WHERE id_pharmacie = ?', ['inactive', req.params.id]);
    res.json({ message: 'Pharmacie désactivée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Détails d'une pharmacie
exports.getPharmacyDetails = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pharmacie WHERE id_pharmacie = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pharmacie non trouvée' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, full_name, email, phone, address FROM admin WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Admin non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { full_name, email, phone, address } = req.body;
    await db.execute('UPDATE admin SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?', [full_name, email, phone, address, req.params.id]);
    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT change password
exports.changeAdminPassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const [rows] = await db.execute('SELECT mot_de_passe FROM admin WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Admin non trouvé' });

    const isMatch = await bcrypt.compare(old_password, rows[0].mot_de_passe);
    if (!isMatch) return res.status(400).json({ error: 'Ancien mot de passe incorrect' });

    const hashed = await bcrypt.hash(new_password, 10);
    await db.execute('UPDATE admin SET mot_de_passe = ? WHERE id = ?', [hashed, req.params.id]);
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// autres fonctions placeholders (doctors/suppliers)
exports.addDoctor = (req, res) => res.send('Add doctor (not implemented)');
exports.deleteDoctor = (req, res) => res.send('Delete doctor (not implemented)');
exports.deactivateDoctor = (req, res) => res.send('Deactivate doctor (not implemented)');
exports.getDoctorDetails = (req, res) => res.send('Get doctor details (not implemented)');

exports.deleteSupplier = (req, res) => res.send('Delete supplier (not implemented)');
exports.activateSupplier = (req, res) => res.send('Activate supplier (not implemented)');
exports.deactivateSupplier = (req, res) => res.send('Deactivate supplier (not implemented)');
exports.getSupplierDetails = (req, res) => res.send('Get supplier details (not implemented)');

