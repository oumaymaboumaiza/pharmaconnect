const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Routes pour les fournisseurs
router.post('/', supplierController.createSupplier);          // Créer un fournisseur
router.get('/', supplierController.getAllSuppliers);         // Lister tous les fournisseurs
router.get('/:id', supplierController.getSupplier);          // Obtenir un fournisseur
router.put('/:id', supplierController.updateSupplier);       // Mettre à jour un fournisseur
router.put('/:id/status', supplierController.toggleStatus);  // Changer le statut
router.delete('/:id', supplierController.deleteSupplier);    // Supprimer un fournisseur

module.exports = router;