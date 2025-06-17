import React, { useState } from 'react';
import axios from 'axios';

const NewPrescription = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [cin, setCin] = useState('');
  const [ordonnance, setOrdonnance] = useState('');
  const [loading, setLoading] = useState(false);
  
  // You should get the doctor ID from your authentication system
  // For now, I'm using a placeholder - replace this with actual doctor ID
  const doctorId = localStorage.getItem('doctorId') || sessionStorage.getItem('doctorId') || 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newOrdonnance = {
        id_doctor: parseInt(doctorId), // Include doctor ID as integer
        nom: nom.trim(),
        prenom: prenom.trim(),
        cin: cin.trim(),
        ordonnance: ordonnance.trim(),
        status: 'En attente',
      };

      console.log('Sending prescription:', newOrdonnance); // For debugging

      const response = await axios.post('http://localhost:5000/api/ordonnances', newOrdonnance);
      
      console.log('Response:', response.data); // For debugging
      
      alert('Prescription ajoutée avec succès !');

      // Réinitialiser les champs
      setNom('');
      setPrenom('');
      setCin('');
      setOrdonnance('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la prescription :', error);
      
      // More detailed error message
      if (error.response) {
        alert(`Erreur: ${error.response.data.error || 'Erreur du serveur'}`);
      } else if (error.request) {
        alert('Erreur: Impossible de contacter le serveur');
      } else {
        alert('Erreur lors de l\'ajout de la prescription.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nouvelle Prescription</h1>
      <div style={styles.doctorInfo}>
        Médecin ID: {doctorId}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="nom" style={styles.label}>Nom du Patient:</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="prenom" style={styles.label}>Prénom:</label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="cin" style={styles.label}>CIN:</label>
          <input
            type="text"
            id="cin"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="ordonnance" style={styles.label}>Ordonnance:</label>
          <textarea
            id="ordonnance"
            value={ordonnance}
            onChange={(e) => setOrdonnance(e.target.value)}
            required
            rows={5}
            style={styles.textarea}
            placeholder="Liste des médicaments à prescrire..."
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          style={{
            ...styles.button,
            backgroundColor: loading ? '#6c757d' : '#007bff',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Ajout en cours...' : 'Ajouter Prescription'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  doctorInfo: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.9em',
    marginBottom: '30px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
};

export default NewPrescription;



