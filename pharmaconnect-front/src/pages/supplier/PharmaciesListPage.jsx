"use client"

import { useState, useEffect } from "react"
import { Building2, Mail, Phone, User, MapPin } from "lucide-react"

const PharmaciesListPage = () => {
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulation du chargement avec données statiques
    const loadPharmacies = () => {
      setLoading(true)

      // Données statiques avec la pharmacie Ibnou Sina
      const staticPharmacies = [
        {
          pharmacy_id: 1,
          nom_pharmacie: "Pharmacie Ibnou Sina",
          pharmacy_email: "sina@pharmaconnect.com",
          pharmacy_phone: "+21652745574",
          president_pharmacie: "Dr Omaya",
        },
      ]

      setTimeout(() => {
        setPharmacies(staticPharmacies)
        setLoading(false)
      }, 1000) // Simulation d'un délai de chargement
    }

    loadPharmacies()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Chargement des pharmacies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#1D10FA] to-purple-600 text-white py-6 px-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Pharmacies Partenaires</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pharmacies.length}</p>
              <p className="text-gray-600">Total Pharmacies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="max-w-7xl mx-auto">
        {pharmacies.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune pharmacie trouvée</h3>
            <p className="text-gray-500">Aucune pharmacie partenaire pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((pharmacy) => (
              <div
                key={pharmacy.pharmacy_id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#1D10FA] to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{pharmacy.nom_pharmacie}</h2>
                      <p className="text-blue-100 text-sm">Pharmacie Partenaire</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{pharmacy.pharmacy_email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{pharmacy.pharmacy_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{pharmacy.president_pharmacie}</span>
                    </div>
                    {pharmacy.adresse && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{pharmacy.adresse}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Remove medication button, keep simple display */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 text-gray-500 border border-gray-200 text-sm font-medium rounded-lg py-2 px-3 flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Pharmacie Partenaire
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PharmaciesListPage
