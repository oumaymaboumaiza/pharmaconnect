"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, XCircle, Clock, Package, MessageSquare, Store, Building } from "lucide-react"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Simulation du chargement avec données statiques
  useEffect(() => {
    const loadNotifications = () => {
      setLoading(true)

      // Données statiques des demandes de médicaments - seulement Ibnou Sina
      const staticNotifications = [
        {
          id: 1,
          nom_medicament: "Paracétamol",
          quantite: 50,
          status: "en_attente",
          nom_pharmacie: "Pharmacie Ibnou Sina",
          president_pharmacie: "Dr Omaya",
          message: "Stock critique, besoin urgent de réapprovisionnement",
          created_at: "2024-01-15T10:30:00Z",
        },
        {
          id: 4,
          nom_medicament: "Aspirine",
          quantite: 30,
          status: "refusee",
          nom_pharmacie: "Pharmacie Ibnou Sina",
          president_pharmacie: "Dr Omaya",
          message: "Stock insuffisant chez le fournisseur",
          created_at: "2024-01-12T16:45:00Z",
        },
      ]

      setTimeout(() => {
        setNotifications(staticNotifications)
        setLoading(false)
      }, 1000) // Simulation d'un délai de chargement
    }

    loadNotifications()
  }, [])

  // Mise à jour du statut d'une notification (simulation)
  const updateStatus = async (id, status) => {
    setUpdatingStatus(id)

    // Simulation d'un délai de traitement
    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)))
      setUpdatingStatus(null)

      // Message de confirmation
      const statusText = status === "acceptee" ? "acceptée" : "refusée"
      alert(`La demande a été ${statusText} avec succès.`)
    }, 1000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "acceptee":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "refusee":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-orange-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "acceptee":
        return "bg-green-100 text-green-800 border-green-200"
      case "refusee":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-orange-100 text-orange-800 border-orange-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "acceptee":
        return "Acceptée"
      case "refusee":
        return "Refusée"
      case "en_attente":
        return "En attente"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1D10FA] to-purple-600 text-white py-8 px-6 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Demandes de Réapprovisionnement</h1>
              <p className="text-blue-100 text-lg">Gérez les demandes des pharmacies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-gray-600">Total demandes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter((n) => n.status === "en_attente").length}
                </p>
                <p className="text-gray-600">En attente</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter((n) => n.status === "acceptee").length}
                </p>
                <p className="text-gray-600">Acceptées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des notifications */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#1D10FA] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des demandes...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune demande</h3>
            <p className="text-gray-500">Vous n'avez aucune demande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{notif.nom_medicament}</h3>
                      <p className="text-sm text-gray-600">Demande #{notif.id}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(notif.status)}`}
                  >
                    {getStatusIcon(notif.status)}
                    <span className="text-sm font-medium">{getStatusText(notif.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>
                      <strong>Quantité:</strong> {notif.quantite}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Store className="w-4 h-4" />
                    <span>
                      <strong>Pharmacie:</strong> {notif.nom_pharmacie}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>
                      <strong>Président:</strong> {notif.president_pharmacie}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong>Demandé le:</strong> {new Date(notif.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {notif.message && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                        <p className="text-gray-600">{notif.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {notif.status === "en_attente" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => updateStatus(notif.id, "acceptee")}
                      disabled={updatingStatus === notif.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {updatingStatus === notif.id ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {updatingStatus === notif.id ? "Traitement..." : "Accepter"}
                    </button>
                    <button
                      onClick={() => updateStatus(notif.id, "refusee")}
                      disabled={updatingStatus === notif.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {updatingStatus === notif.id ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {updatingStatus === notif.id ? "Traitement..." : "Refuser"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
