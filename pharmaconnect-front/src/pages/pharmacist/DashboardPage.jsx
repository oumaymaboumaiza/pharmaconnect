"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Package, Search, Eye, Minus, Send, X, Plus, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [medicaments, setMedicaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMed, setSelectedMed] = useState(null)

  // États pour le popup de demande
  const [showDemandePopup, setShowDemandePopup] = useState(false)
  const [selectedMedicamentDemande, setSelectedMedicamentDemande] = useState(null)
  const [quantiteDemande, setQuantiteDemande] = useState("")
  const [popupLoading, setPopupLoading] = useState(false)
  const [popupError, setPopupError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/medicaments")
        const dataWithStatus = res.data.map((m) => ({
          ...m,
          status: m.quantite <= 50 ? "critical" : "normal",
          currentStock: m.quantite,
          maxStock: 500,
          expiryDate: new Date(2025, 6, 15),
        }))

        setMedicaments(dataWithStatus)
      } catch (error) {
        console.error("Erreur lors du chargement du stock :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const diminuerQuantite = async (id, currentQuantite) => {
    if (currentQuantite <= 0) return

    try {
      const nouvelleQuantite = currentQuantite - 1
      await axios.put(`http://localhost:5000/api/medicaments/${id}/quantite`, {
        quantite: nouvelleQuantite,
      })

      setMedicaments((prev) =>
        prev.map((m) => (m.id === id ? { ...m, currentStock: nouvelleQuantite, quantite: nouvelleQuantite } : m)),
      )
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité", error)
    }
  }

  // Fonction pour ouvrir le popup de demande
  const ouvrirPopupDemande = (medicament) => {
    setSelectedMedicamentDemande(medicament)
    setShowDemandePopup(true)
    setQuantiteDemande("")
    setPopupError("")
  }

  // Fonction pour fermer le popup
  const fermerPopupDemande = () => {
    setShowDemandePopup(false)
    setSelectedMedicamentDemande(null)
    setQuantiteDemande("")
    setPopupError("")
  }

  // Fonction pour envoyer une demande au fournisseur (avec popup)
  const envoyerDemandeAvecPopup = async (e) => {
    e.preventDefault()

    if (!quantiteDemande || quantiteDemande <= 0) {
      setPopupError("Veuillez saisir une quantité valide")
      return
    }

    setPopupLoading(true)
    setPopupError("")

    try {
      const pharmacie_id = localStorage.getItem("userId") || localStorage.getItem("pharmacyId") || 7
      const supplier_id = 3 // ID fournisseur par défaut

      const response = await axios.post("http://localhost:5000/api/demandes/create", {
        pharmacie_id: Number.parseInt(pharmacie_id),
        supplier_id: supplier_id,
        nom_medicament: selectedMedicamentDemande.nom,
        quantite: Number.parseInt(quantiteDemande),
      })

      if (response.data.success) {
        fermerPopupDemande()
        alert("Demande envoyée avec succès !")
      } else {
        setPopupError(response.data.error || "Erreur lors de l'envoi de la demande")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error)
      setPopupError("Erreur de connexion au serveur")
    } finally {
      setPopupLoading(false)
    }
  }

  const filtered = medicaments.filter((m) => m.nom.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = {
    total: medicaments.length,
    normal: medicaments.filter((m) => m.status === "normal").length,
    critical: medicaments.filter((m) => m.status === "critical").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Stock des Médicaments</h1>
              <p className="text-blue-100">Suivi du stock en pharmacie</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 gap-4 -mt-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-gray-600">Total Produits</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.normal}</div>
          <div className="text-gray-600">Stock Normal</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.critical}</div>
          <div className="text-gray-600">Stock Critique</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8">Aucun médicament trouvé</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{m.nom}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(m.status)}`}>
                    {m.status === "normal" ? "Normal" : "Critique"}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span>
                      Stock: {m.currentStock}/{m.maxStock}
                    </span>
                    <span>{((m.currentStock / m.maxStock) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${m.status === "critical" ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${(m.currentStock / m.maxStock) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm">Prix : {Number(m.prix).toFixed(2)} TND</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMed(m)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => diminuerQuantite(m.id, m.currentStock)}
                      disabled={m.currentStock <= 0}
                      className={`p-2 rounded-lg ${
                        m.currentStock > 0 ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      title="Diminuer quantité"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    {/* Nouveau bouton avec popup */}
                    <button
                      onClick={() => ouvrirPopupDemande(m)}
                      className="px-3 py-2 bg-green-100 text-green-600 rounded-lg font-medium hover:bg-green-200 transition-colors duration-200 flex items-center gap-1"
                      title="Faire une demande détaillée"
                    >
                      <Plus className="w-4 h-4" />
                      Demander
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal détails médicament (existant) */}
      {selectedMed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b flex justify-between">
              <h3 className="font-bold text-lg">{selectedMed.nom}</h3>
              <button onClick={() => setSelectedMed(null)}>✕</button>
            </div>
            <div className="p-4 space-y-4">
              <p>
                <strong>Quantité:</strong> {selectedMed.currentStock}
              </p>
              <p>
                <strong>Prix:</strong> {Number(selectedMed.prix).toFixed(2)} TND
              </p>
              <p>
                <strong>Date d'expiration:</strong> {selectedMed.expiryDate.toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => setSelectedMed(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DE DEMANDE SIMPLIFIÉ (SANS FOURNISSEUR) */}
      {showDemandePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Header du popup */}
            <div className="bg-gradient-to-r from-[#1D10FA] to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Faire une demande</h2>
                    <p className="text-blue-100 text-sm">{selectedMedicamentDemande?.nom}</p>
                  </div>
                </div>
                <button
                  onClick={fermerPopupDemande}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu du popup */}
            <form onSubmit={envoyerDemandeAvecPopup} className="p-6">
              {/* Informations du médicament */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Détails de la demande</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Médicament:</span>
                    <span className="font-medium text-gray-800">{selectedMedicamentDemande?.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock actuel:</span>
                    <span
                      className={`font-medium ${selectedMedicamentDemande?.status === "critical" ? "text-red-600" : "text-green-600"}`}
                    >
                      {selectedMedicamentDemande?.currentStock}
                    </span>
                  </div>
                  {selectedMedicamentDemande?.prix && (
                    <div className="flex justify-between">
                      <span>Prix unitaire:</span>
                      <span className="font-medium text-gray-800">{selectedMedicamentDemande.prix} TND</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Champ quantité */}
              <div className="mb-6">
                <label htmlFor="quantite" className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantité demandée *
                </label>
                <input
                  type="number"
                  id="quantite"
                  value={quantiteDemande}
                  onChange={(e) => setQuantiteDemande(e.target.value)}
                  min="1"
                  required
                  disabled={popupLoading}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#1D10FA] transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D10FA]/20 disabled:opacity-50"
                  placeholder="Entrez la quantité souhaitée"
                />
              </div>

              {/* Calcul du total si prix disponible */}
              {selectedMedicamentDemande?.prix && quantiteDemande && (
                <div className="bg-green-50 rounded-lg p-3 mb-6 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Total estimé:</span>
                    <span className="text-green-800 font-bold text-lg">
                      {(
                        Number.parseFloat(selectedMedicamentDemande.prix) * Number.parseInt(quantiteDemande || 0)
                      ).toFixed(2)}{" "}
                      TND
                    </span>
                  </div>
                </div>
              )}

              {/* Message d'erreur */}
              {popupError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700 text-sm">{popupError}</span>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={fermerPopupDemande}
                  disabled={popupLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={popupLoading || !quantiteDemande}
                  className="flex-1 bg-gradient-to-r from-[#1D10FA] to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {popupLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
