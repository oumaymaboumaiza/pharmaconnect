const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Create and Read
router.post('/', doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getProfile);

// Update
router.put('/:id', doctorController.updateProfile);
router.put('/:id/change-password', doctorController.changePassword);
router.put('/:id/status', doctorController.toggleDoctorStatus);

// Delete
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
