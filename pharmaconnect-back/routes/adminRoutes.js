const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const doctorController = require("../controllers/doctorController");
const supplierController = require("../controllers/supplierController");
console.log('doctorController.createDoctor = ', doctorController.createDoctor);


// ===== PHARMACY ROUTES =====
router.post("/pharmacies", adminController.addPharmacy);
router.get("/pharmacies", adminController.getAllPharmacies);
router.delete("/pharmacies/:id", adminController.deletePharmacy);
router.put("/pharmacies/:id/status", adminController.togglePharmacyStatus); // ✅ CORRIGÉ
router.get("/pharmacies/:id", adminController.getPharmacyDetails);

// ===== DOCTOR ROUTES =====
router.post("/doctors", doctorController.createDoctor); // ✅ CORRIGÉ
router.get("/doctors", doctorController.getAllDoctors); // ✅ AJOUTÉ
router.delete("/doctors/:id", doctorController.deleteDoctor); // ✅ CORRIGÉ
router.put("/doctors/:id/status", doctorController.toggleDoctorStatus); // ✅ CORRIGÉ
router.get("/doctors/:id", doctorController.getProfile); // ✅ CORRIGÉ

// ===== SUPPLIER ROUTES =====
router.post("/suppliers", supplierController.createSupplier); // ✅ AJOUTÉ2
router.get("/suppliers", supplierController.getAllSuppliers); // ✅ AJOUTÉ
router.delete("/suppliers/:id", supplierController.deleteSupplier); // ✅ CORRIGÉ
router.put("/suppliers/:id/status", supplierController.toggleStatus); // ✅ CORRIGÉ (unifié activate/deactivate)
router.get("/suppliers/:id", supplierController.getSupplier); // ✅ CORRIGÉ

// ===== ADMIN PROFILE ROUTES =====
router.get("/:id", adminController.getAdminProfile);
router.put("/:id", adminController.updateAdminProfile);
router.put("/:id/change-password", adminController.changeAdminPassword);

module.exports = router;
