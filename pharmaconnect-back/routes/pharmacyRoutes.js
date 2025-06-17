const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const userController = require('../controllers/userController');


// Use consistent admin verification middleware
const verifyAdmin = userController.verifyAdmin; 

// Pharmacy routes
router.post('/', verifyAdmin, pharmacyController.createPharmacy);
router.get('/', verifyAdmin, pharmacyController.getAllPharmacies);
router.get('/:id', pharmacyController.getProfile);
router.put('/:id', pharmacyController.updateProfile);
router.put('/:id/change-password', pharmacyController.changePassword);
router.put('/:id/status', verifyAdmin, pharmacyController.toggleStatus);
router.delete('/:id', verifyAdmin, pharmacyController.deletePharmacy);

module.exports = router;