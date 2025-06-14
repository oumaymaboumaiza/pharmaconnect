const db = require('../db');
const bcrypt = require('bcrypt');

// Create new supplier
exports.createSupplier = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone } = req.body;
    
    if (!nom || !prenom || !email || !password || !telephone) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Check if email exists
    const [existing] = await db.execute(
      'SELECT id FROM suppliers WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Un fournisseur avec cet email existe déjà' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create supplier
    const [result] = await db.execute(
      'INSERT INTO suppliers (nom, prenom, email, password, telephone, is_active, created_at) VALUES (?, ?, ?, ?, ?, 1, NOW())',
      [nom, prenom, email, hashedPassword, telephone]
    );

    // Return created supplier (without password)
    const [newSupplier] = await db.execute(
      'SELECT id, nom, prenom, email, telephone, is_active FROM suppliers WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newSupplier[0]);
  } catch (err) {
    console.error('Erreur création fournisseur:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const [suppliers] = await db.execute(
      'SELECT id, nom, prenom, email, telephone, is_active FROM suppliers ORDER BY nom, prenom'
    );
    res.json(suppliers);
  } catch (err) {
    console.error('Erreur récupération fournisseurs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single supplier
exports.getSupplier = async (req, res) => {
  try {
    const [supplier] = await db.execute(
      'SELECT id, nom, prenom, email, telephone, is_active FROM suppliers WHERE id = ?',
      [req.params.id]
    );
    
    if (supplier.length === 0) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }
    
    res.json(supplier[0]);
  } catch (err) {
    console.error('Erreur récupération fournisseur:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { nom, prenom, email, telephone } = req.body;
    const supplierId = req.params.id;

    if (!nom || !prenom || !email || !telephone) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Check if email exists for another supplier
    const [existing] = await db.execute(
      'SELECT id FROM suppliers WHERE email = ? AND id != ?',
      [email, supplierId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé par un autre fournisseur' });
    }

    await db.execute(
      'UPDATE suppliers SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?',
      [nom, prenom, email, telephone, supplierId]
    );

    // Return updated supplier
    const [updatedSupplier] = await db.execute(
      'SELECT id, nom, prenom, email, telephone, is_active FROM suppliers WHERE id = ?',
      [supplierId]
    );

    res.json(updatedSupplier[0]);
  } catch (err) {
    console.error('Erreur mise à jour fournisseur:', err);
    res.status(500).json({ error: err.message });
  }
};

// Toggle supplier status
exports.toggleStatus = async (req, res) => {
  try {
    const [current] = await db.execute(
      'SELECT is_active FROM suppliers WHERE id = ?',
      [req.params.id]
    );
    
    if (current.length === 0) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }
    
    const newStatus = current[0].is_active ? 0 : 1;
    
    await db.execute(
      'UPDATE suppliers SET is_active = ? WHERE id = ?',
      [newStatus, req.params.id]
    );
    
    res.json({ 
      message: `Fournisseur ${newStatus ? 'activé' : 'désactivé'} avec succès`,
      is_active: newStatus 
    });
  } catch (err) {
    console.error('Erreur changement statut fournisseur:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM suppliers WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }
    
    res.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression fournisseur:', err);
    res.status(500).json({ error: err.message });
  }
};