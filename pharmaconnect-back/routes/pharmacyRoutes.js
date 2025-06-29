const express = require("express")
const router = express.Router()
const pharmacyController = require("../controllers/pharmacyController")
const userController = require("../controllers/userController")

// Use consistent admin verification middleware
const verifyAdmin = userController.verifyAdmin

// Pharmacy routes
router.post("/", verifyAdmin, pharmacyController.createPharmacy)
router.get("/", verifyAdmin, pharmacyController.getAllPharmacies)
router.get("/:id", pharmacyController.getProfile)

// ✅ IMPORTANT: Route pour la modification (utilisée par le frontend)
router.put("/:id", verifyAdmin, pharmacyController.updatePharmacy)

// ✅ Route pour la mise à jour du profil (gardée pour compatibilité)
router.put("/:id/profile", pharmacyController.updateProfile)

router.put("/:id/change-password", pharmacyController.changePassword)

// ✅ IMPORTANT: Route pour le toggle status (utilisée par le frontend)
router.put("/:id/status", verifyAdmin, pharmacyController.togglePharmacyStatus)

router.delete("/:id", verifyAdmin, pharmacyController.deletePharmacy)

module.exports = router
