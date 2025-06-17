const db = require('../db');

// ✅ Obtenir toutes les ordonnances
exports.getAllOrdonnances = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ordonnances ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des ordonnances :', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mettre à jour le statut d'une ordonnance
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [ord] = await db.execute('SELECT * FROM ordonnances WHERE id = ?', [id]);
    if (ord.length === 0) {
      return res.status(404).json({ error: 'Ordonnance non trouvée' });
    }

    await db.execute('UPDATE ordonnances SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Créer une nouvelle ordonnance
exports.createOrdonnance = async (req, res) => {
  const { id_doctor, cin, nom, prenom, ordonnance } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO ordonnances (id_doctor, cin, nom, prenom, ordonnance, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id_doctor, cin, nom, prenom, ordonnance, 'En attente']
    );
    res.status(201).json({ message: 'Ordonnance créée', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de la création de l’ordonnance :', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdonnanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const [ord] = await db.execute('SELECT * FROM ordonnances WHERE id = ?', [id]);
    if (ord.length === 0) {
      return res.status(404).json({ error: 'Ordonnance non trouvée' });
    }
    res.json(ord[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l’ordonnance :', error);
    res.status(500).json({ error: error.message });
  }
};
