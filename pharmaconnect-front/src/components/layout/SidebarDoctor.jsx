import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Settings } from 'lucide-react';

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

const SidebarDoctor = ({ isOpen }) => {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Doctor Panel</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <NavItem to="/doctor/patients" icon={<User size={20} />} label="Patients" />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <NavItem to="/doctor/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </div>
    </aside>
  );
};

export default SidebarDoctor;