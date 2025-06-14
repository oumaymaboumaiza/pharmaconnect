import React, { useState, useEffect } from 'react';

const PharmaciesListPage = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler un appel API
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        // Remplacez ceci par votre véritable appel API
        const response = await new Promise(resolve => setTimeout(() => {
          resolve([
            { id: 1, name: 'Pharmacie Centrale', address: '123 Rue Principale', phone: '555-1234' },
            { id: 2, name: 'Pharmacie du Centre', address: '456 Avenue de la Liberté', phone: '555-5678' },
            { id: 3, name: 'Pharmacie de la Gare', address: '789 Boulevard de la Gare', phone: '555-9012' },
          ]);
        }, 1000));
        setPharmacies(response);
      } catch (err) {
        setError("Erreur lors du chargement des pharmacies.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  if (loading) {
    return <div style={styles.container}>Chargement des pharmacies...</div>;
  }

  if (error) {
    return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Liste des Pharmacies</h1>
      {pharmacies.length === 0 ? (
        <p>Aucune pharmacie trouvée.</p>
      ) : (
        <ul style={styles.pharmacyList}>
          {pharmacies.map(pharmacy => (
            <li key={pharmacy.id} style={styles.pharmacyItem}>
              <h2 style={styles.pharmacyName}>{pharmacy.name}</h2>
              <p><strong>Adresse:</strong> {pharmacy.address}</p>
              <p><strong>Téléphone:</strong> {pharmacy.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  pharmacyList: {
    listStyle: 'none',
    padding: 0,
  },
  pharmacyItem: {
    marginBottom: '15px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  pharmacyName: {
    color: '#007bff',
    marginBottom: '5px',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
};

export default PharmaciesListPage;

