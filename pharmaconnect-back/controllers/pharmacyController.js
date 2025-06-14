// pharmacyController.js
const db = require('../db');
const bcrypt = require('bcrypt');

// Get pharmacy profile by id
exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.execute('SELECT id_pharmacie, nom_pharmacie, email, telephone, president_pharmacie FROM pharmacie WHERE id_pharmacie = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pharmacie non trouvée' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update pharmacy profile (except password)
exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { nom_pharmacie, email, telephone, president_pharmacie } = req.body;
    await db.execute(
      'UPDATE pharmacie SET nom_pharmacie = ?, email = ?, telephone = ?, president_pharmacie = ? WHERE id_pharmacie = ?',
      [nom_pharmacie, email, telephone, president_pharmacie, id]
    );
    res.json({ message: 'Pharmacie mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change pharmacy password
exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { old_password, new_password } = req.body;

    // Get current password hash
    const [rows] = await db.execute('SELECT mot_de_passe FROM pharmacie WHERE id_pharmacie = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pharmacie non trouvée' });

    const currentHash = rows[0].mot_de_passe;

    // Compare old_password
    const match = await bcrypt.compare(old_password, currentHash);
    if (!match) return res.status(400).json({ error: 'Ancien mot de passe incorrect' });

    // Hash new password
    const newHashed = await bcrypt.hash(new_password, 10);

    // Update password
    await db.execute('UPDATE pharmacie SET mot_de_passe = ? WHERE id_pharmacie = ?', [newHashed, id]);
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to pharmacyController.js
exports.toggleStatus = async (req, res) => {
  try {
    const { active } = req.body;
    const id = req.params.id;

    const [pharmacy] = await db.execute('SELECT id_pharmacie FROM pharmacie WHERE id_pharmacie = ?', [id]);
    if (pharmacy.length === 0) {
      return res.status(404).json({ error: 'Pharmacie non trouvée' });
    }

    await db.execute('UPDATE pharmacie SET is_active = ? WHERE id_pharmacie = ?', [active ? 1 : 0, id]);
    
    const [updatedPharmacy] = await db.execute(
      'SELECT id_pharmacie, nom_pharmacie, email, telephone, president_pharmacie, is_active FROM pharmacie WHERE id_pharmacie = ?',
      [id]
    );
    res.json({ pharmacy: updatedPharmacy[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};