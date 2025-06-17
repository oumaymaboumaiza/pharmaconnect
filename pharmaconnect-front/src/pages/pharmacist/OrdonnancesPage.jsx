import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdonnancesPage = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [searchNom, setSearchNom] = useState('');
  const [searchPrenom, setSearchPrenom] = useState('');
  const [searchCin, setSearchCin] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ordonnances');
        setOrdonnances(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des ordonnances :', error);
      }
    };

    fetchOrdonnances();
  }, []);

  const handleEffectuer = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/ordonnances/${id}/status`, { status: 'Effectuée' });
      setOrdonnances((prev) =>
        prev.map((ord) => (ord.id === id ? { ...ord, status: 'Effectuée' } : ord))
      );
      alert(`Ordonnance ${id} marquée comme effectuée.`);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const filtered = ordonnances.filter((ord) =>
    ord.status !== 'Effectuée' &&
    ord.nom.toLowerCase().includes(searchNom.toLowerCase()) &&
    ord.prenom.toLowerCase().includes(searchPrenom.toLowerCase()) &&
    ord.cin.includes(searchCin)
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Ordonnances en Attente</h1>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Nom"
          value={searchNom}
          onChange={(e) => setSearchNom(e.target.value)}
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Prénom"
          value={searchPrenom}
          onChange={(e) => setSearchPrenom(e.target.value)}
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="CIN"
          value={searchCin}
          onChange={(e) => setSearchCin(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.buttonSearch}>
          Rechercher
        </button>
      </div>

      {searchTriggered && filtered.length === 0 ? (
        <p style={styles.noResults}>Aucune ordonnance trouvée.</p>
      ) : (
        filtered.map((ord) => (
          <div key={ord.id} style={styles.ordonnanceCard}>
            <h2 style={styles.ordonnanceId}>Ordonnance N°: {ord.id}</h2>
            <p style={styles.dateEmission}>
              Date d'émission : {new Date(ord.created_at).toLocaleDateString()}
            </p>

            <div style={styles.section}>
              <h3 style={styles.subtitle}>Patient</h3>
              <p><strong>Nom :</strong> {ord.nom}</p>
              <p><strong>Prénom :</strong> {ord.prenom}</p>
              <p><strong>CIN :</strong> {ord.cin}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.subtitle}>Prescription</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{ord.ordonnance}</pre>
            </div>

            <div style={styles.actions}>
              <button
                onClick={() => handleEffectuer(ord.id)}
                style={styles.buttonEffectuer}
              >
                Effectuer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '2.2em',
    fontWeight: '600',
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
  },
  buttonSearch: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noResults: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.1em',
    marginTop: '50px',
  },
  ordonnanceCard: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '25px',
  },
  ordonnanceId: {
    fontSize: '1.5em',
    color: '#3498db',
    marginBottom: '10px',
  },
  dateEmission: {
    fontSize: '0.9em',
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  subtitle: {
    fontSize: '1.2em',
    color: '#2980b9',
    marginBottom: '10px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
  },
  buttonEffectuer: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default OrdonnancesPage;
