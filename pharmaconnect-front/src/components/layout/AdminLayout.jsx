import React, { useState } from 'react';
import SidebarAdmin from "./SidebarAdmin"; // ou SidebarPharmacist
import Navbar from "./Navbar"; // Assurez-vous que le chemin est correct
import { Outlet } from 'react-router-dom';

function AdminLayout() { // ou PharmacistLayout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin isOpen={isSidebarOpen} /> {/* Sidebar est fixe */}

      {/* APPLIQUEZ lg:ml-64 À CE DIV QUI CONTIENT LA NAVBAR ET LE MAIN */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64"> 
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4"> {/* RETIREZ lg:ml-64 D'ICI */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; // ou PharmacistLayout
