const bcrypt = require('bcryptjs');
const db = require('../db');
const jwt = require('jsonwebtoken');

// Créer un utilisateur
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Connexion
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Middleware admin
exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (!users.length || users[0].role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    req.user = users[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Ajouter un docteur
exports.addDoctor = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Champs requis' });

  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'doctor']);

    res.status(201).json({ message: 'Docteur ajouté', doctor: { id: result.insertId, email, role: 'doctor' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir tous les docteurs
exports.getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await db.execute('SELECT id, email, created_at FROM users WHERE role = ?', ['doctor']);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un docteur
exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const [doctor] = await db.execute('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'doctor']);
    if (!doctor.length) return res.status(404).json({ error: 'Docteur introuvable' });

    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Docteur supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
