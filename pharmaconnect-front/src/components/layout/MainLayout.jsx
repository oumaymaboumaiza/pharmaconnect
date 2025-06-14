import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './SidebarAdmin';
import { useAuth } from "../../hooks/useAuth";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Pharmacist-specific sidebar items
  const pharmacistSidebarItems = [
    { path: "/pharmacy/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/pharmacy/inventory", label: "Inventory", icon: "inventory" },
    { path: "/pharmacy/prescriptions", label: "Prescriptions", icon: "prescription" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} items={pharmacistSidebarItems} />
      
      <div className={`lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-300`}>
        <Navbar onToggleSidebar={toggleSidebar} user={user} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-5 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;