"use client"

import { NavLink } from "react-router-dom"
import { Home, FileText, Package, ShoppingCart, Settings, User, LogOut, Pill } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

const NavItem = ({ to, icon, label, isActive = false }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
          isActive ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`p-2 rounded-md transition-all duration-200 ${
              isActive ? "bg-white shadow-sm" : "bg-transparent group-hover:bg-white/50"
            }`}
          >
            <span className={`${isActive ? "text-gray-700" : "text-gray-500 group-hover:text-gray-700"}`}>{icon}</span>
          </div>
          <span className="ml-3 font-medium text-sm">{label}</span>
          {isActive && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-gray-900 rounded-l-full"></div>
          )}
        </>
      )}
    </NavLink>
  )
}

const SidebarPharmacist = ({ isOpen }) => {
  const { user, logout } = useAuth()
  const role = user?.role || "PHARMACIST"

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => {}} // Add close handler here
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-sm transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Simple Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Pill className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Pharmacist Panel</h1>
                <p className="text-gray-500 text-sm">Gestion pharmaceutique</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                Navigation Principale
              </h3>

              <div className="space-y-2">
                <NavItem to="/pharmacy/dashboard" icon={<Home size={20} />} label="Tableau de Bord" />
                <NavItem to="/pharmacy/ordonnances" icon={<FileText size={20} />} label="Ordonnances" />
                 <NavItem to="/pharmacy/supplier" icon={<Package size={20} />} label="Fournisseurs" />
                 <NavItem to="/pharmacy/demandes" icon={<FileText size={20} />} label="Demandes" />
              </div>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavItem to="/pharmacy/settings" icon={<Settings size={18} />} label="Paramètres" />

              {/* User Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user?.name || "Pharmacien"}</p>
                    <p className="text-gray-500 text-xs capitalize">{role.toLowerCase()}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full mt-2 group flex items-center py-2 px-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} className="text-gray-500 group-hover:text-red-500" />
                <span className="ml-3 font-medium text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default SidebarPharmacist
