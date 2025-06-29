const db = require("../db")

// Récupérer les demandes avec statistiques (FIXED VERSION)
exports.getDemandesByPharmacie = async (req, res) => {
  const pharmacieId = req.params.id
  console.log("🔍 Récupération demandes pour pharmacie :", pharmacieId)

  try {
    // Test database connection first
    console.log("📊 Testing database connection...")
    await db.execute("SELECT 1")
    console.log("✅ Database connection OK")

    // Récupérer les demandes avec détails
    console.log("📋 Executing demandes query...")
    const [demandes] = await db.execute(
      `SELECT 
        d.id, 
        d.nom_medicament, 
        d.quantite, 
        d.status, 
        d.date_acceptation,
        d.created_at,
        d.supplier_id,
        COALESCE(f.nom_fournisseur, 'Non spécifié') as nom_fournisseur,
        f.email as fournisseur_email,
        f.telephone as fournisseur_telephone
       FROM demandes d
       LEFT JOIN fournisseurs f ON d.supplier_id = f.id
       WHERE d.pharmacie_id = ?
       ORDER BY d.created_at DESC`,
      [pharmacieId],
    )

    console.log(`✅ Found ${demandes.length} demandes`)

    // Calculer les statistiques
    const stats = {
      total: demandes.length,
      en_attente: demandes.filter((d) => d.status === "en_attente").length,
      acceptees: demandes.filter((d) => d.status === "acceptee").length,
      recues: demandes.filter((d) => d.status === "reçue").length,
    }

    console.log("📊 Stats calculated:", stats)

    res.status(200).json({
      success: true,
      demandes,
      stats,
    })
  } catch (error) {
    console.error("❌ Erreur récupération demandes :", error)
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    })

    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des demandes.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Test endpoint to check if API is working
exports.testConnection = async (req, res) => {
  try {
    console.log("🧪 Testing API connection...")
    const [result] = await db.execute("SELECT NOW() as current_time, DATABASE() as database_name")

    res.status(200).json({
      success: true,
      message: "API and database connection working",
      data: result[0],
    })
  } catch (error) {
    console.error("❌ Test connection failed:", error)
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      details: error.message,
    })
  }
}

// Keep your existing functions
exports.updateDemandeStatus = async (req, res) => {
  const demandeId = req.params.id
  const { status } = req.body

  console.log(`🔄 Updating demande ${demandeId} to status: ${status}`)

  // Validation des statuts
  const allowedStatuses = ["en_attente", "acceptee", "reçue", "non_livree"]
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Statut invalide fourni.",
    })
  }

  try {
    // Mise à jour du statut avec date
    const updateFields = status === "acceptee" ? "status = ?, date_acceptation = NOW()" : "status = ?"
    const params = status === "acceptee" ? [status, demandeId] : [status, demandeId]

    const [result] = await db.execute(`UPDATE demandes SET ${updateFields} WHERE id = ?`, params)

    console.log(`✅ Updated ${result.affectedRows} rows`)

    // Si statut reçue, mise à jour du stock
    if (status === "reçue") {
      const [rows] = await db.execute(`SELECT nom_medicament, quantite, pharmacie_id FROM demandes WHERE id = ?`, [
        demandeId,
      ])

      if (rows.length > 0) {
        const demande = rows[0]
        // Mise à jour du stock
        await db.execute(
          `UPDATE medicaments_stock
           SET quantite = quantite + ?
           WHERE nom = ? AND id_pharmacie = ?`,
          [demande.quantite, demande.nom_medicament, demande.pharmacie_id],
        )
        console.log(`✅ Stock updated for ${demande.nom_medicament}`)
      }
    }

    res.status(200).json({
      success: true,
      message: "Statut de la demande mis à jour avec succès.",
    })
  } catch (error) {
    console.error("❌ Erreur mise à jour statut :", error)
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la mise à jour du statut.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

exports.createDemande = async (req, res) => {
  const { pharmacie_id, supplier_id, nom_medicament, quantite } = req.body

  console.log("📝 Creating new demande:", { pharmacie_id, supplier_id, nom_medicament, quantite })

  // Validation des données
  if (!pharmacie_id || !supplier_id || !nom_medicament || !quantite) {
    return res.status(400).json({
      success: false,
      error: "Tous les champs sont obligatoires",
    })
  }

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    // Créer la demande
    const [result] = await connection.execute(
      `INSERT INTO demandes (pharmacie_id, supplier_id, nom_medicament, quantite, status, created_at)
       VALUES (?, ?, ?, ?, 'en_attente', NOW())`,
      [pharmacie_id, supplier_id, nom_medicament, quantite],
    )

    const demandeId = result.insertId
    console.log(`✅ Created demande with ID: ${demandeId}`)

    // Créer la notification pour le fournisseur
    await connection.execute(
      `INSERT INTO notifications (nom_medicament, quantite, pharmacien_id, fournisseur_id, message, status, demande_id, created_at)
       VALUES (?, ?, ?, ?, ?, 'en_attente', ?, NOW())`,
      [nom_medicament, quantite, pharmacie_id, supplier_id, "Nouvelle demande de médicament reçue", demandeId],
    )

    await connection.commit()
    console.log("✅ Transaction completed successfully")

    res.status(201).json({
      success: true,
      message: "Demande créée et notification envoyée avec succès",
      demande_id: demandeId,
    })
  } catch (error) {
    await connection.rollback()
    console.error("❌ Erreur création demande :", error)
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la création de la demande",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  } finally {
    connection.release()
  }
}
