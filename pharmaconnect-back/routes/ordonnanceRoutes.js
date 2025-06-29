const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controllers/ordonnanceController');

// ✅ Toutes les routes nécessaires
router.get('/', ordonnanceController.getAllOrdonnances);
router.get('/:id', ordonnanceController.getOrdonnanceById);
router.post('/', ordonnanceController.createOrdonnance);
router.put('/:id/status', ordonnanceController.updateStatus);
router.put('/:id', ordonnanceController.updateOrdonnance); // ✅ corrigé ici
router.delete('/:id', ordonnanceController.deleteOrdonnance); // optionnel

module.exports = router;
