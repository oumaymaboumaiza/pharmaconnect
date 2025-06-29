import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const PharmaciesListPage = () => {
  const { user } = useAuth();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        const supplierId = user?.id || user?.supplier_id;
        if (!supplierId) {
          setError('ID du fournisseur non trouvé');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/suppliers/${supplierId}/pharmacies`);
        if (response.data.success) {
          console.log("Pharmacies reçues:", response.data.pharmacies);
          setPharmacies(response.data.pharmacies);
        } else {
          setError('Erreur lors de la récupération des pharmacies');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des pharmacies');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPharmacies();
  }, [user]);

  if (loading) return <div className="text-center py-6">Chargement...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Liste des Pharmacies Partenaires</h1>
      <div className="space-y-6">
        {pharmacies.map(pharmacy => (
          <div key={pharmacy.pharmacy_id} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-blue-700">{pharmacy.nom_pharmacie}</h2>
            <p className="text-sm text-gray-600">Email : {pharmacy.pharmacy_email}</p>
            <p className="text-sm text-gray-600">Téléphone : {pharmacy.pharmacy_phone}</p>
            <p className="text-sm text-gray-600">Président : {pharmacy.president_pharmacie}</p>

            {/* ✅ Bouton Détails si médicaments demandés */}
            {pharmacy.medicaments_demandes?.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Détails
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ MODAL */}
      {selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              Médicaments demandés par {selectedPharmacy.nom_pharmacie}
            </h2>
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <ul className="space-y-2">
              {selectedPharmacy.medicaments_demandes.map((med, i) => (
                <li key={i} className="flex justify-between items-center border-b py-2">
                  <span className="text-gray-800">
                    {med.nom} — Quantité : {med.quantite}
                  </span>
                  <span className="text-xs text-yellow-600 font-semibold">
                    En attente
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmaciesListPage;
