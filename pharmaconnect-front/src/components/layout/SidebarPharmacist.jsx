import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Package,
  ShoppingCart,
  Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-2 px-4 rounded-md transition-colors ${
          isActive
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const SidebarPharmacist = ({ isOpen }) => {
  const { user } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          {/* Logo ou titre ici si besoin */}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem to="/pharmacy/dashboard" icon={<Home size={20} />} label="Dashboard" /> {/* CHANGEMENT ICI */}

          <NavItem to="/pharmacy/ordonnances" icon={<FileText size={20} />} label="Ordonnances" /> {/* CHANGEMENT ICI */}

          <NavItem to="/pharmacy/stocks" icon={<ShoppingCart size={20} />} label="Stocks" /> {/* CHANGEMENT ICI */}

          <NavItem to="/pharmacy/suppliers" icon={<Package size={20} />} label="Supplier" /> {/* CHANGEMENT ICI */}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </div>
    </aside>
  );
};

export default SidebarPharmacist;
