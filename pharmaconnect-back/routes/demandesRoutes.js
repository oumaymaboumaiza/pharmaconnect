const express = require("express")
const router = express.Router()
const demandesController = require("../controllers/demandesController")

// AJOUTEZ JUSTE CETTE LIGNE
router.get("/test", demandesController.testConnection)

// Vos routes existantes
router.get("/pharmacie/:id", demandesController.getDemandesByPharmacie)
router.put("/:id/status", demandesController.updateDemandeStatus)
router.post("/create", demandesController.createDemande)

module.exports = router
