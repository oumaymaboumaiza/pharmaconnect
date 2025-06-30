import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages Auth
import LoginPage from './pages/auth/LoginPage';

// Dashboard général (maintenant réservé aux pharmaciens uniquement)
import DashboardPage from './pages/pharmacist/DashboardPage';

// Pages Admin
import PharmacyManagementPage  from './pages/admin/PharmacyManagementPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage'; 
import DocteurPage from './pages/admin/DocteurPage'; // gestion des docteurs par l'admin

// Pages Pharmacien
import OrdonnancesPage from './pages/pharmacist/OrdonnancesPage';

import PharmacistSupplierPage from './pages/pharmacist/PharmacistSupplierPage';

// Pages Docteur
import NewPrescription from "./pages/doctor/NewPrescription"; 
import DoctorsOrdonnancesPage from "./pages/doctor/DoctorsOrdonnancesPage"; 

// Pages Fournisseur
import PharmaciesListPage from './pages/supplier/PharmaciesListPage'; 
import NotificationsPage from './pages/supplier/NotificationsPage';

// import SupplierMainPage from './components/layout/SupplierMainPage'; // Supprimé

// Pages Docteur
//import DoctorMainPage from './components/layout/DoctorMainPage'; // optionnel si différent

// Pages partagées
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import PharmacistLayout from './components/layout/PharmacistLayout';
import SupplierLayout from './components/layout/SupplierLayout';
import DoctorLayout from './components/layout/DoctorLayout';
import MainLayout from './components/layout/MainLayout';

// Importation des nouvelles pages



// Protection des routes
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Redirection selon rôle
const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.role) {
    case 'admin':
      return <Navigate to="/pharmacies" replace />;
    case 'pharmacist':
      return <Navigate to="/pharmacy/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/docteur" replace />;
    case 'supplier':
      return <Navigate to="/supplier" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ✅ Route publique */}
          <Route path="/login" element={<LoginPage />} />

          {/* ✅ Redirection automatique après login */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* ✅ Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/pharmacies" element={<PharmacyManagementPage />} />
              <Route path="/admin/dashboard" element={<DashboardAdminPage />} />
              <Route path="/admin/doctors" element={<DocteurPage />} />
            </Route>
          </Route>

          {/* ✅ Pharmacist */}
          <Route element={<ProtectedRoute allowedRoles={['pharmacist']} />}>
            <Route element={<PharmacistLayout />}>
              <Route path="/pharmacy/dashboard" element={<DashboardPage />} />
              <Route path="/pharmacy/ordonnances" element={<OrdonnancesPage />} />
              <Route path="/pharmacy/supplier" element={<PharmacistSupplierPage />} />
            </Route>
          </Route>

          {/* ✅ Supplier */}
          <Route element={<ProtectedRoute allowedRoles={['supplier']} />}>
            <Route element={<SupplierLayout />}>
              <Route path="/supplier" element={<PharmaciesListPage />} />
              <Route path="/supplier/notifications" element={<NotificationsPage />} />

            </Route>
          </Route>

          {/* ✅ Doctor */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route element={<DoctorLayout />}>
              <Route path="/docteur" element={<NewPrescription />} />
              <Route path="/docteur/ordonnances" element={<DoctorsOrdonnancesPage />} />
            </Route>

          </Route>

          {/* ✅ Routes partagées (sans dashboard) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'pharmacist', 'doctor', 'supplier']} />}>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ✅ Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

