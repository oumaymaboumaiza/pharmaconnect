const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notificationController")

// Routes pour les notifications
router.get("/fournisseur/:fournisseurId", notificationController.getNotificationsByFournisseur)
router.put("/update-status/:id", notificationController.updateNotificationStatus)
router.post("/", notificationController.createNotification)
router.get("/", notificationController.getAllNotifications)

module.exports = router
