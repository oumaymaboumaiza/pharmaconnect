// src/pages/pharmacist/DashboardPage.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../hooks/useAuth'; 
import PharmacyDashboard from "../dashboard/pharmacy";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Chargement...</p>;

  // Seul le pharmacien a accès au dashboard
  if (user.role === 'pharmacist') {
    return <PharmacyDashboard />;
  }

  // Tous les autres rôles n'ont pas accès au dashboard
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '50vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2>Accès non autorisé</h2>
      <p>Vous n'avez pas accès au tableau de bord.</p>
      <p>Seuls les pharmaciens disposent d'un tableau de bord.</p>
    </div>
  );
};

export default DashboardPage;

