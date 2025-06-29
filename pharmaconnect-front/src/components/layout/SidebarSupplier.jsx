import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Store, Settings, Bell } from 'lucide-react';
import axios from 'axios';
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

const SidebarSupplier = ({ isOpen }) => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/fournisseur/${user.id}`);
        const enAttente = res.data.filter(n => n.status === 'en_attente');
        setNotificationCount(enAttente.length);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Supplier Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <NavItem to="/supplier/pharmacies" icon={<Store size={20} />} label="Pharmacies" />

            {/* Notifications avec badge */}
            <Link
              to="/supplier/notifications"
              className="flex items-center py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative"
            >
              <span className="mr-3 relative">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </span>
              <span>Notifications</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <NavItem to="/supplier/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </div>
    </aside>
  );
};

export default SidebarSupplier;
