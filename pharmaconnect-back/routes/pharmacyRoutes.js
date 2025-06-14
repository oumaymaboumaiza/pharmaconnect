// pharmacyRoutes.js
const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

router.get('/:id', pharmacyController.getProfile);
router.put('/:id', pharmacyController.updateProfile);
router.put('/:id/change-password', pharmacyController.changePassword);
router.put('/:id/status', pharmacyController.toggleStatus);  // Changer le statut

module.exports = router;
