const db = require('../db');
const bcrypt = require('bcrypt');

// Get doctor profile by id
exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.execute('SELECT id, nom, prenom, email, cin, specialty, is_active FROM doctors WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Médecin non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, cin, specialty } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !cin || !specialty) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Check if email already exists
    const [existingDoctors] = await db.execute('SELECT id FROM doctors WHERE email = ?', [email]);
    if (existingDoctors.length > 0) {
      return res.status(400).json({ error: 'Un médecin avec cet email existe déjà' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO doctors (prenom, nom, email, password, cin, specialty, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [firstName, lastName, email, hashedPassword, cin, specialty, 1]
    );
    
    const [newDoctor] = await db.execute(
      'SELECT id, nom, prenom, email, cin, specialty, is_active FROM doctors WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ doctor: newDoctor[0] });
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nom, prenom, email, cin, specialty, is_active FROM doctors ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update doctor profile
exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, cin, specialty } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !cin || !specialty) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Check if email exists for other doctors
    const [existingDoctors] = await db.execute(
      'SELECT id FROM doctors WHERE email = ? AND id != ?',
      [email, id]
    );
    if (existingDoctors.length > 0) {
      return res.status(400).json({ error: 'Un médecin avec cet email existe déjà' });
    }
    
    await db.execute(
      'UPDATE doctors SET prenom = ?, nom = ?, email = ?, cin = ?, specialty = ? WHERE id = ?',
      [firstName, lastName, email, cin, specialty, id]
    );
    
    const [updatedDoctor] = await db.execute(
      'SELECT id, nom, prenom, email, cin, specialty, is_active FROM doctors WHERE id = ?',
      [id]
    );

    if (!updatedDoctor[0]) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }

    res.json({ doctor: updatedDoctor[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Change doctor password
exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({ error: 'Les deux mots de passe sont requis' });
    }

    const [rows] = await db.execute('SELECT password FROM doctors WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Médecin non trouvé' });

    const match = await bcrypt.compare(old_password, rows[0].password);
    if (!match) return res.status(400).json({ error: 'Ancien mot de passe incorrect' });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.execute('UPDATE doctors SET password = ? WHERE id = ?', [hashedPassword, id]);
    
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const [doctor] = await db.execute('SELECT id FROM doctors WHERE id = ?', [req.params.id]);
    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }

    await db.execute('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    res.json({ message: 'Médecin supprimé avec succès' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Toggle doctor status
exports.toggleDoctorStatus = async (req, res) => {
  try {
    const { active } = req.body;
    const id = req.params.id;

    const [doctor] = await db.execute('SELECT id FROM doctors WHERE id = ?', [id]);
    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }

    await db.execute('UPDATE doctors SET is_active = ? WHERE id = ?', [active ? 1 : 0, id]);
    
    const [updatedDoctor] = await db.execute(
      'SELECT id, nom, prenom, email, cin, specialty, is_active FROM doctors WHERE id = ?',
      [id]
    );
    res.json({ doctor: updatedDoctor[0] });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: err.message });
  }
};