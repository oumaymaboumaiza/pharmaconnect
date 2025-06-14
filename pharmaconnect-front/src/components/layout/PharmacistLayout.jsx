import React, { useState } from 'react';
import SidebarPharmacist from "./SidebarPharmacist";
import Navbar from "./Navbar"; // Assurez-vous que le chemin vers Navbar est correct
import { Outlet } from 'react-router-dom';

function PharmacistLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarPharmacist isOpen={isSidebarOpen} />

      {/* La classe lg:ml-64 est maintenant sur ce div */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64"> 
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* La classe lg:ml-64 a été retirée d'ici */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PharmacistLayout;
