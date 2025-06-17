import React, { useState } from 'react';
import axios from 'axios';

const NewPharmacyPage = () => {
  const [formData, setFormData] = useState({
    nom_pharmacie: '',
    email: '',
    telephone: '',
    password: '',
    president_pharmacie: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const validateForm = () => {
    const { nom_pharmacie, email, telephone, password, president_pharmacie } = formData;

    if (!nom_pharmacie.trim() || !email.trim() || !telephone.trim() || !password || !president_pharmacie.trim()) {
      setError('Tous les champs sont obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      return false;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    if (!phoneRegex.test(telephone)) {
      setError('Numéro de téléphone invalide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      setError('Vous devez être connecté en tant qu\'administrateur');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/pharmacies',
        {
          nom_pharmacie: formData.nom_pharmacie.trim(),
          email: formData.email.trim().toLowerCase(),
          telephone: formData.telephone.trim(),
          password: formData.password,
          president_pharmacie: formData.president_pharmacie.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(
        `✅ Pharmacie "${formData.nom_pharmacie}" créée avec succès!\n` +
        `📧 Compte pharmacien créé pour: ${formData.email}\n` +
        `🔑 Le pharmacien peut maintenant se connecter avec cet email et mot de passe.`
      );

      setFormData({
        nom_pharmacie: '',
        email: '',
        telephone: '',
        password: '',
        president_pharmacie: ''
      });

    } catch (err) {
      console.error('Erreur création pharmacie:', err);
      
      const errorMessage = err.response?.data?.error || err.message;
      
      if (errorMessage.includes('email existe déjà')) {
        setError('⚠️ Une pharmacie ou un compte avec cet email existe déjà');
      } else if (errorMessage.includes('obligatoires')) {
        setError('⚠️ Tous les champs sont obligatoires');
      } else {
        setError(`❌ ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Ajouter une nouvelle pharmacie
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { 
            name: 'nom_pharmacie', 
            label: 'Nom de la pharmacie', 
            type: 'text',
            placeholder: 'Ex: Pharmacie Centrale'
          },
          { 
            name: 'email', 
            label: 'Email du pharmacien', 
            type: 'email',
            placeholder: 'pharmacien@exemple.com'
          },
          { 
            name: 'telephone', 
            label: 'Téléphone', 
            type: 'tel',
            placeholder: 'Ex: +216 XX XXX XXX'
          },
          { 
            name: 'password', 
            label: 'Mot de passe', 
            type: 'password',
            placeholder: 'Minimum 6 caractères'
          },
          { 
            name: 'president_pharmacie', 
            label: 'Président de la pharmacie', 
            type: 'text',
            placeholder: 'Nom du président'
          }
        ].map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-colors ${
                loading 
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </span>
          ) : (
            '🏥 Créer la pharmacie et le compte'
          )}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          <div className="whitespace-pre-line text-sm">{message}</div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}
    </div>
  );
};

export default NewPharmacyPage;