import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Store, 
  FileText, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Home 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { User } from "lucide-react"; 


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

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
        
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />

{['ADMIN', 'PHARMACY'].includes(role) && (
  <NavItem to="/pharmacies" icon={<Store size={20} />} label="Pharmacies" />
)}

{['ADMIN', 'DOCTOR', 'PHARMACY'].includes(role) && (
  <NavItem to="/prescriptions" icon={<FileText size={20} />} label="Prescriptions" />
)}

{['ADMIN', 'PHARMACY'].includes(role) && (
  <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" />
)}

{['ADMIN', 'DOCTOR'].includes(role) && (
  <NavItem to="/docteur" icon={<User size={20} />} label="Doctor" />
)}  

{['ADMIN', 'SUPPLIER'].includes(role) && (
  <NavItem to="/supplier" icon={<Package size={20} />} label="Supplier" />
)}

        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;