const express = require('express');
const router = express.Router();
const tt = require('../controllers/supplierController');

// Routes pour les fournisseurs
router.post('/', tt.createSupplier);
router.get('/', tt.getAllSuppliers);
router.get('/:id', tt.getSupplier);
router.put('/:id', tt.updateSupplier);
router.put('/:id/status', tt.toggleStatus);
router.delete('/:id', tt.deleteSupplier);
router.get('/:id/pharmacies', tt.getPharmaciesBySupplierId); // ✅ corrigé ici
router.post('/:supplierId/pharmacies/:pharmacyId', tt.addPharmacyToSupplier);
router.get('/suppliers/:supplierId/pharmacies', tt.getPharmaciesWithDemandes);

module.exports = router;
