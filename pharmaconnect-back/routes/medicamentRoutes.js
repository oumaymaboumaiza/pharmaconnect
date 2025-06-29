const express = require('express');
const router = express.Router();
const medicamentController = require('../controllers/medicamentController');

// Route pour récupérer tous les médicaments
router.get('/', medicamentController.getAllMedicaments);

// Route pour mettre à jour la quantité (ex: diminution)
router.put('/:id/quantite', medicamentController.updateQuantite);
router.post('/demande/:pharmacyId', medicamentController.handleDemande);


module.exports = router;
