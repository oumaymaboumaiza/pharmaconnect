import React from 'react';

const SidebarSupplier = ({ isOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
      <h2 className="text-2xl font-semibold mb-6">Supplier Sidebar</h2>
      <nav>
        <ul>
          <li className="mb-2"><a href="#" className="block hover:text-gray-300">Dashboard</a></li>
          <li className="mb-2"><a href="#" className="block hover:text-gray-300">Orders</a></li>
          <li className="mb-2"><a href="#" className="block hover:text-gray-300">Products</a></li>
          <li className="mb-2"><a href="#" className="block hover:text-gray-300">Settings</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarSupplier;

