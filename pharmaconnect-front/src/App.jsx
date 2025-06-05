import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PharmacyListPage from './pages/pharmacyListPage';
import StocksPage from './pages/StocksPage';
import ProfilePage from './pages/ProfilePage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import SettingsPage from './pages/SettingsPage';
import DocteurPage from './pages/DocteurPage';
import SupplierPage from './pages/SupplierPage';
import NewPharmacyPage from './pages/NewPharmacyPage';




function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Add more routes for other pages here */}
              <Route path="/pharmacies" element={<PharmacyListPage/>} />
              <Route path="/prescriptions" element={<PrescriptionsPage/>} />
               <Route path="/inventory" element={<StocksPage/>} />
              <Route path="/settings" element={<SettingsPage/>} />
              <Route path="/profile" element={<ProfilePage/>} />
              <Route path="/docteur" element={<DocteurPage/>} />
              <Route path="/new-pharmacy" element={<NewPharmacyPage/>} />
              <Route element={<ProtectedRoute allowedRoles={['SUPPLIER', 'ADMIN']} />}>
               <Route path="/supplier" element={<SupplierPage />} />
</Route>
               
            </Route>
          </Route>
          
          {/* Redirect to dashboard if logged in, otherwise to login */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;