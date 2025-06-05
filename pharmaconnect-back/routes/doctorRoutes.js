const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Create and Read
router.post('/doctors', doctorController.createDoctor);
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getProfile);

// Update
router.put('/doctors/:id', doctorController.updateProfile);
router.put('/doctors/:id/change-password', doctorController.changePassword);
router.put('/doctors/:id/status', doctorController.toggleDoctorStatus);

// Delete
router.delete('/doctors/:id', doctorController.deleteDoctor);

module.exports = router;