import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircle, Loader2, AlertCircle, Trash2, Eye, MapPin, Phone, Clock } from "lucide-react";

export default function PharmacyListPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/pharmacies");
        setPharmacies(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des pharmacies");
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pharmacy?')) {
      setPharmacies(pharmacies.filter(pharmacy => pharmacy.id_pharmacie !== id));
      await axios.delete(`http://localhost:5000/api/admin/pharmacies/${id}`);
    }
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.nom_pharmacie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <span className="ml-3 text-lg">Loading pharmacies...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 my-8 rounded-md">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
        <div>
          <h3 className="font-medium text-red-800">Loading Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pharmacy Directory</h1>
        <button onClick={() => navigate("/new-pharmacy")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <PlusCircle className="h-5 w-5" /> Add New Pharmacy
        </button>
      </div>

      <input type="text" placeholder="Search pharmacies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg" />

      {filteredPharmacies.length === 0 ? (
        <p className="text-center text-gray-500">No pharmacies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPharmacies.map(pharmacy => (
            <div key={pharmacy.id_pharmacie} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold">{pharmacy.nom_pharmacie}</h3>
              <p className="text-sm text-gray-600">{pharmacy.email}</p>
              <p className="text-sm text-gray-600">{pharmacy.telephone}</p>
              <p className="text-sm text-gray-600">Président : {pharmacy.president_pharmacie}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate(`/pharmacies/${pharmacy.id_pharmacie}`)}
                  className="flex-1 border px-3 py-1 rounded hover:bg-gray-50">View</button>
                <button onClick={() => handleDelete(pharmacy.id_pharmacie)}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}