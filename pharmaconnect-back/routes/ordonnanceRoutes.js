const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controllers/ordonnanceController');

// Routes
router.get('/', ordonnanceController.getAllOrdonnances);
router.put('/:id/status', ordonnanceController.updateStatus);
router.post('/', ordonnanceController.createOrdonnance);


module.exports = router;
