"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  User,
  Calendar,
  RefreshCw,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react"

const DemandesPage = () => {
  const [demandes, setDemandes] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Récupérer l'ID de la pharmacie
  const pharmacyId = localStorage.getItem("pharmacyId") || sessionStorage.getItem("pharmacyId") || "1"

  useEffect(() => {
    console.log("🚀 Component mounted, fetching demandes...")
    fetchDemandes()
  }, [])

  const testConnection = async () => {
    try {
      console.log("🧪 Testing API connection...")
      const response = await axios.get("http://localhost:5000/api/demandes/test")
      console.log("✅ API test successful:", response.data)
      return true
    } catch (err) {
      console.error("❌ API test failed:", err)
      return false
    }
  }

  const fetchDemandes = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Récupération des demandes pour pharmacie:", pharmacyId)

      // First test the connection
      const connectionOk = await testConnection()
      if (!connectionOk) {
        throw new Error("API connection failed")
      }

      const response = await axios.get(`http://localhost:5000/api/demandes/pharmacie/${pharmacyId}`, {
        timeout: 10000, // 10 second timeout
      })

      console.log("📦 API Response:", response.data)

      if (response.data.success) {
        setDemandes(response.data.demandes || [])
        setStats(response.data.stats || {})
        console.log("✅ Demandes loaded successfully:", response.data.demandes?.length || 0)
      } else {
        throw new Error(response.data.error || "Erreur lors du chargement des demandes")
      }
    } catch (err) {
      console.error("❌ Erreur complète:", err)

      let errorMessage = "Erreur serveur"

      if (err.code === "ECONNREFUSED") {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez que le serveur est démarré."
      } else if (err.code === "ENOTFOUND") {
        errorMessage = "Serveur introuvable. Vérifiez l'URL de l'API."
      } else if (err.response) {
        errorMessage = err.response.data?.error || `Erreur ${err.response.status}: ${err.response.statusText}`
        console.error("❌ Response error:", err.response.data)
      } else if (err.request) {
        errorMessage = "Aucune réponse du serveur. Vérifiez votre connexion."
        console.error("❌ Request error:", err.request)
      } else {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateDemandeStatus = async (demandeId, newStatus) => {
    setUpdatingStatus(demandeId)
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      console.log(`🔄 Updating demande ${demandeId} to status: ${newStatus}`)

      const response = await axios.put(
        `http://localhost:5000/api/demandes/${demandeId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        },
      )

      if (response.data.success) {
        setDemandes((prev) => prev.map((d) => (d.id === demandeId ? { ...d, status: newStatus } : d)))
        console.log("✅ Status updated successfully")
        // Refresh to get updated stats
        fetchDemandes()
      } else {
        throw new Error(response.data.error || "Erreur lors de la mise à jour du statut")
      }
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err)
      setError(err.response?.data?.error || err.message || "Erreur lors de la mise à jour")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "en_attente":
        return <Clock className="w-5 h-5 text-orange-500" />
      case "acceptee":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "reçue":
        return <Truck className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "en_attente":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "acceptee":
        return "bg-green-100 text-green-800 border-green-200"
      case "reçue":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "en_attente":
        return "En attente"
      case "acceptee":
        return "Acceptée"
      case "reçue":
        return "Reçue"
      default:
        return status
    }
  }

  const StatusButton = ({ status, currentStatus, demandeId, label, icon }) => {
    const isActive = currentStatus === status
    const isUpdating = updatingStatus === demandeId

    return (
      <button
        onClick={() => updateDemandeStatus(demandeId, status)}
        disabled={isUpdating || isActive}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive ? `${getStatusColor(status)} shadow-md` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isActive ? "cursor-default" : ""}`}
      >
        {isUpdating ? (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          icon
        )}
        {isUpdating ? "..." : label}
      </button>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Chargement des demandes...</p>
          <p className="text-gray-500 text-center text-sm mt-2">Pharmacie ID: {pharmacyId}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Erreur de connexion</h3>
                <p className="text-red-600">{error}</p>
                <p className="text-red-500 text-sm mt-2">
                  Vérifiez que le serveur backend est démarré sur http://localhost:5000
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={fetchDemandes}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                onClick={testConnection}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                🧪 Test API
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1D10FA] to-purple-600 text-white py-8 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Mes Demandes</h1>
                <p className="text-blue-100 text-lg">Suivez vos demandes de médicaments</p>
              </div>
            </div>
            <button
              onClick={fetchDemandes}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.en_attente || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.acceptees || 0}</p>
                <p className="text-gray-600">Acceptées</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.recues || 0}</p>
                <p className="text-gray-600">Reçues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        {demandes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune demande</h3>
            <p className="text-gray-500">Vous n'avez envoyé aucune demande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {demandes.map((demande) => (
              <div
                key={demande.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{demande.nom_medicament}</h3>
                      <p className="text-sm text-gray-600">Demande #{demande.id}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(demande.status)}`}
                  >
                    {getStatusIcon(demande.status)}
                    <span className="text-sm font-medium">{getStatusText(demande.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      <strong>Quantité:</strong> {demande.quantite}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>
                      <strong>Fournisseur:</strong> {demande.nom_fournisseur || "Non spécifié"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      <strong>Demandé le:</strong> {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                {/* Informations du fournisseur */}
                {demande.nom_fournisseur && demande.nom_fournisseur !== "Non spécifié" && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations du fournisseur
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {demande.fournisseur_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{demande.fournisseur_email}</span>
                        </div>
                      )}
                      {demande.fournisseur_telephone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{demande.fournisseur_telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Boutons de statut */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <StatusButton
                    status="en_attente"
                    currentStatus={demande.status}
                    demandeId={demande.id}
                    label="En attente"
                    icon={<Clock className="w-4 h-4" />}
                  />
                  <StatusButton
                    status="acceptee"
                    currentStatus={demande.status}
                    demandeId={demande.id}
                    label="Acceptée"
                    icon={<CheckCircle className="w-4 h-4" />}
                  />
                  <StatusButton
                    status="reçue"
                    currentStatus={demande.status}
                    demandeId={demande.id}
                    label="Reçue"
                    icon={<Truck className="w-4 h-4" />}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DemandesPage
