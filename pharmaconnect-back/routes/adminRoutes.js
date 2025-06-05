const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Pharmacy
router.post('/pharmacies', adminController.addPharmacy);
router.get('/pharmacies', adminController.getAllPharmacies);
router.delete('/pharmacies/:id', adminController.deletePharmacy);
router.put('/pharmacies/:id/deactivate', adminController.deactivatePharmacy);
router.get('/pharmacies/:id', adminController.getPharmacyDetails);
router.get('/pharmacies', adminController.getAllPharmacies);


// Doctor
router.post('/doctors', adminController.addDoctor);
router.delete('/doctors/:id', adminController.deleteDoctor);
router.put('/doctors/:id/deactivate', adminController.deactivateDoctor);
router.get('/doctors/:id', adminController.getDoctorDetails);

// Supplier
router.delete('/suppliers/:id', adminController.deleteSupplier);
router.put('/suppliers/:id/activate', adminController.activateSupplier);
router.put('/suppliers/:id/deactivate', adminController.deactivateSupplier);
router.get('/suppliers/:id', adminController.getSupplierDetails);

module.exports = router;