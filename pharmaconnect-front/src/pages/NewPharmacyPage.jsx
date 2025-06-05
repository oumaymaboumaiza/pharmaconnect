import React, { useState } from 'react';
import axios from 'axios';

const NewPharmacyPage = () => {
  const [formData, setFormData] = useState({
    nom_pharmacie: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    president_pharmacie: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/pharmacies', formData);
      setMessage(`✅ Pharmacie ajoutée avec l’ID : ${response.data.id}`);
      setFormData({
        nom_pharmacie: '',
        email: '',
        telephone: '',
        mot_de_passe: '',
        president_pharmacie: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’ajout de la pharmacie');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Ajouter une nouvelle pharmacie</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nom_pharmacie" placeholder="Nom de la pharmacie" value={formData.nom_pharmacie} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />

        <input type="text" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />

        <input type="password" name="mot_de_passe" placeholder="Mot de passe" value={formData.mot_de_passe} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />

        <input type="text" name="president_pharmacie" placeholder="Président de la pharmacie" value={formData.president_pharmacie} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ajouter</button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default NewPharmacyPage;
