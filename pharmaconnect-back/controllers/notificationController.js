const db = require("../db")

// Récupérer les notifications d'un fournisseur avec les noms des pharmacies
exports.getNotificationsByFournisseur = async (req, res) => {
  try {
    const { fournisseurId } = req.params

    const [rows] = await db.execute(
      `SELECT 
        n.id,
        n.nom_medicament,
        n.nom,
        n.quantite,
        n.message,
        n.status,
        n.created_at,
        n.pharmacien_id,
        p.nom_pharmacie,
        p.president_pharmacie
       FROM notifications n
       LEFT JOIN pharmacie p ON n.pharmacien_id = p.id_pharmacie
       WHERE n.fournisseur_id = ?
       ORDER BY n.created_at DESC`,
      [fournisseurId],
    )

    res.json(rows)
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error)
    res.status(500).json({
      error: "Erreur lors de la récupération des notifications",
      details: error.message,
    })
  }
}

// Mettre à jour le statut d'une notification
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validation du statut
    const validStatuses = ["en_attente", "acceptee", "refusee"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" })
    }

    const [result] = await db.execute("UPDATE notifications SET status = ? WHERE id = ?", [status, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification non trouvée" })
    }

    res.json({ message: "Statut mis à jour avec succès" })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    res.status(500).json({
      error: "Erreur lors de la mise à jour du statut",
      details: error.message,
    })
  }
}

// Créer une nouvelle notification
exports.createNotification = async (req, res) => {
  try {
    const { nom_medicament, quantite, pharmacien_id, fournisseur_id, message } = req.body

    // Validation des données
    if (!nom_medicament || !quantite || !pharmacien_id || !fournisseur_id) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis" })
    }

    const [result] = await db.execute(
      `INSERT INTO notifications (nom_medicament, quantite, pharmacien_id, fournisseur_id, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'en_attente', NOW())`,
      [nom_medicament, quantite, pharmacien_id, fournisseur_id, message || ""],
    )

    res.status(201).json({
      message: "Notification créée avec succès",
      id: result.insertId,
    })
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error)
    res.status(500).json({
      error: "Erreur lors de la création de la notification",
      details: error.message,
    })
  }
}

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        n.id,
        n.nom_medicament,
        n.nom,
        n.quantite,
        n.message,
        n.status,
        n.created_at,
        n.pharmacien_id,
        n.fournisseur_id,
        p.nom_pharmacie,
        p.president_pharmacie
       FROM notifications n
       LEFT JOIN pharmacie p ON n.pharmacien_id = p.id_pharmacie
       ORDER BY n.created_at DESC`,
    )

    res.json(rows)
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les notifications:", error)
    res.status(500).json({
      error: "Erreur lors de la récupération des notifications",
      details: error.message,
    })
  }
}
