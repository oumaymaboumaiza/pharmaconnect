import React, { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers');
    const data = await res.json();
    setSuppliers(data);
  };

  const handleAdd = async () => {
    await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplier),
    });
    setNewSupplier({ nom: '', prenom: '', email: '', password: '' });
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  const handleDeactivate = async (id) => {
    await fetch(`/api/suppliers/${id}/deactivate`, { method: 'PUT' });
    fetchSuppliers();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des Fournisseurs 🧾</h2>

      {/* Add Supplier Form */}
      <div className="mb-4 space-x-2">
        <input
          placeholder="Nom"
          value={newSupplier.nom}
          onChange={e => setNewSupplier({ ...newSupplier, nom: e.target.value })}
          className="border p-1"
        />
        <input
          placeholder="Prénom"
          value={newSupplier.prenom}
          onChange={e => setNewSupplier({ ...newSupplier, prenom: e.target.value })}
          className="border p-1"
        />
        <input
          placeholder="Email"
          type="email"
          value={newSupplier.email}
          onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
          className="border p-1"
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={newSupplier.password}
          onChange={e => setNewSupplier({ ...newSupplier, password: e.target.value })}
          className="border p-1"
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-2 py-1 rounded">Ajouter</button>
      </div>

      {/* Suppliers Table */}
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((sup) => (
            <tr key={sup.id}>
              <td>{sup.nom}</td>
              <td>{sup.prenom}</td>
              <td>{sup.email}</td>
              <td className="space-x-2">
                <button onClick={() => setSelectedSupplier(sup)} className="text-blue-600">Détails</button>
                <button onClick={() => handleDeactivate(sup.id)} className="text-yellow-600">Désactiver</button>
                <button onClick={() => handleDelete(sup.id)} className="text-red-600">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details Modal */}
      {selectedSupplier && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 border shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Détails du Fournisseur</h3>
          <p><strong>Nom:</strong> {selectedSupplier.nom}</p>
          <p><strong>Prénom:</strong> {selectedSupplier.prenom}</p>
          <p><strong>Email:</strong> {selectedSupplier.email}</p>
          <button onClick={() => setSelectedSupplier(null)} className="mt-2 text-sm text-gray-500">Fermer</button>
        </div>
      )}
    </div>
  );
}
