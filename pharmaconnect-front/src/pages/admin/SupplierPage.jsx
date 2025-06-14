import React, { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdd = async () => {
    // Validation des champs
    if (!newSupplier.nom || !newSupplier.prenom || !newSupplier.email || !newSupplier.password || !newSupplier.telephone) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (!/^[0-9]{10}$/.test(newSupplier.telephone)) {
      setError('Le numéro doit contenir 10 chiffres');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSupplier.email)) {
      setError('Email invalide');
      return;
    }

    if (newSupplier.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout');
      }

      // Réinitialiser le formulaire après l'ajout
      setNewSupplier({ nom: '', prenom: '', email: '', password: '', telephone: '' });
      setError('');
      await fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur de suppression');
      await fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/suppliers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
      
      if (!res.ok) throw new Error('Erreur de changement de statut');
      await fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gestion des Fournisseurs</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Supplier Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Ajouter un fournisseur</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <input
            placeholder="Nom *"
            value={newSupplier.nom}
            onChange={(e) => setNewSupplier({...newSupplier, nom: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Prénom *"
            value={newSupplier.prenom}
            onChange={(e) => setNewSupplier({...newSupplier, prenom: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Email *"
            type="email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Mot de passe *"
            type="password"
            value={newSupplier.password}
            onChange={(e) => setNewSupplier({...newSupplier, password: e.target.value})}
            className="p-2 border rounded"
            required
            minLength="6"
          />
          <input
            placeholder="Téléphone *"
            value={newSupplier.telephone}
            onChange={(e) => setNewSupplier({...newSupplier, telephone: e.target.value})}
            className="p-2 border rounded"
            maxLength="10"
            required
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'En cours...' : 'Ajouter'}
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Prénom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Téléphone</th>
              <th className="py-3 px-4 text-left">Statut</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{supplier.nom}</td>
                <td className="py-3 px-4">{supplier.prenom}</td>
                <td className="py-3 px-4">{supplier.email}</td>
                <td className="py-3 px-4">{supplier.telephone}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    supplier.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => setSelectedSupplier(supplier)}
                    className="text-blue-600 hover:underline"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => toggleStatus(supplier.id, supplier.is_active)}
                    disabled={loading}
                    className={`${
                      supplier.is_active 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    } hover:underline`}
                  >
                    {supplier.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    disabled={loading}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Détails du Fournisseur</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">Nom:</span> {selectedSupplier.nom}</p>
              <p><span className="font-semibold">Prénom:</span> {selectedSupplier.prenom}</p>
              <p><span className="font-semibold">Email:</span> {selectedSupplier.email}</p>
              <p><span className="font-semibold">Téléphone:</span> {selectedSupplier.telephone}</p>
              <p>
                <span className="font-semibold">Statut:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedSupplier.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedSupplier.is_active ? 'Actif' : 'Inactif'}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}