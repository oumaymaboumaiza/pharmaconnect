import React, { useState } from 'react';
import SidebarSupplier from './SidebarSupplier';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

function SupplierLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarSupplier isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SupplierLayout;


