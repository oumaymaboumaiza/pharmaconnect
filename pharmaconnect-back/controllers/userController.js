const bcrypt = require('bcryptjs');
const db = require('../db');
const jwt = require('jsonwebtoken');

// Nouvelle fonction exportée pour créer et sauvegarder un utilisateur
// Cette fonction peut être appelée par d'autres contrôleurs (doctorController, supplierController, etc.)
exports.createAndSaveUser = async (email, password, role) => {
  if (!email || !password || !role) {
    // Plutôt que de renvoyer une réponse HTTP ici, nous lançons une erreur
    // que le contrôleur appelant pourra attraper.
    throw new Error('All fields (email, password, role) are required for user creation');
  }

  try {
    // Vérifier si l'utilisateur existe déjà (optionnel mais recommandé ici pour éviter les doublons)
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    await db.execute(sql, [email, hashedPassword, role]);
    return { success: true, message: 'User account created successfully' };
  } catch (err) {
    console.error('Error in createAndSaveUser:', err);
    // Relancer l'erreur pour que le contrôleur appelant puisse la gérer
    throw err; 
  }
};

// Votre fonction createUser existante (si elle est toujours utilisée directement par une route /register)
// Elle peut maintenant appeler createAndSaveUser
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    await exports.createAndSaveUser(email, password, role); // Appel à la nouvelle fonction
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user via /register:', err);
    // Gérer les erreurs spécifiques de createAndSaveUser
    if (err.message.includes('User with this email already exists')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
// controllers/userController.js

exports.verifyAdmin = (req, res, next) => {
  // Ta logique pour vérifier le rôle admin
  if (req.user && req.user.role === 'admin') {
    next(); // OK
  } else {
    res.status(403).json({ message: 'Accès refusé : administrateur uniquement' });
  }
};
