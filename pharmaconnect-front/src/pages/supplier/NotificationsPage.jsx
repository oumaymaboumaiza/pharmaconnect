"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle, XCircle, Clock, Package, MessageSquare, Store, Building } from "lucide-react"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Exemple d'ID fournisseur à remplacer par celui du fournisseur connecté
  const fournisseurId = 3

  // Récupération des notifications du fournisseur
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:5000/api/notifications/fournisseur/${fournisseurId}`)
        const data = await res.json()

        if (res.ok) {
          setNotifications(data)
          setError(null)
        } else {
          setError(data.error || "Erreur lors de la récupération")
        }
      } catch (err) {
        setError("Erreur serveur lors de la récupération")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [fournisseurId])

  // Mise à jour du statut d'une notification
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)))
      } else {
        const data = await res.json()
        alert(data.error || "Erreur lors de la mise à jour du statut")
      }
    } catch (error) {
      console.error("Erreur mise à jour statut :", error)
      alert("Erreur serveur lors de la mise à jour du statut")
    }
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
              <h1 className="text-4xl font-bold">Notifications</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Messages d'état */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg shadow-md">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-800 font-medium">Erreur: {error}</p>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-gray-600">Total notifications</p>
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
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune notification</h3>
            <p className="text-gray-500">Vous n'avez aucune notification pour le moment.</p>
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
                      <h3 className="text-lg font-bold text-gray-800">{notif.nom_medicament || notif.nom}</h3>
                      <p className="text-sm text-gray-600">Notification #{notif.id}</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(notif.status)}`}
                  >
                    {getStatusIcon(notif.status)}
                    <span className="text-sm font-medium">{getStatusText(notif.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>
                      <strong>Quantité:</strong> {notif.quantite}
                    </span>
                  </div>

                  {/* Affichage du nom de la pharmacie au lieu de l'ID */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Store className="w-4 h-4" />
                    <span>
                      <strong>Pharmacie:</strong> {notif.nom_pharmacie || "Pharmacie inconnue"}
                    </span>
                  </div>
                </div>

                {/* Affichage du président de la pharmacie si disponible */}
                {notif.president_pharmacie && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>
                        <strong>Président:</strong> {notif.president_pharmacie}
                      </span>
                    </div>
                  </div>
                )}

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
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accepter
                    </button>
                    <button
                      onClick={() => updateStatus(notif.id, "refusee")}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Refuser
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
