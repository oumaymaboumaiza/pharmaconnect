import React, { useState, useEffect } from 'react';

const OrdonnancesPage = () => {
  // Données d'ordonnances fictives
  const allOrdonnances = [
    {
      id: 'ORD-001',
      patient: { nom: 'Dupont', prenom: 'Jean', cin: '12345678' },
      medecin: { nom: 'Martin', prenom: 'Sophie', specialite: 'Généraliste' },
      dateEmission: '2024-06-10',
      medicaments: [
        { nom: 'Amoxicilline', dosage: '500 mg', posologie: '1 cp 3x/jour', quantite: '21' },
        { nom: 'Paracétamol', dosage: '1000 mg', posologie: '1 cp si douleur', quantite: '8' },
      ],
      instructionsSpeciales: 'Prendre avec un grand verre d\'eau.',
    },
    {
      id: 'ORD-002',
      patient: { nom: 'Durand', prenom: 'Marie', cin: '87654321' },
      medecin: { nom: 'Lefevre', prenom: 'Pierre', specialite: 'Pédiatre' },
      dateEmission: '2024-06-12',
      medicaments: [
        { nom: 'Doliprane', dosage: '500 mg', posologie: '1 suppo 2x/jour', quantite: '10' },
      ],
      instructionsSpeciales: 'Administrer après les repas.',
    },
    {
      id: 'ORD-003',
      patient: { nom: 'Petit', prenom: 'Luc', cin: '11223344' },
      medecin: { nom: 'Dubois', prenom: 'Anne', specialite: 'Cardiologue' },
      dateEmission: '2024-06-13',
      medicaments: [
        { nom: 'Bisoprolol', dosage: '5 mg', posologie: '1 cp 1x/jour', quantite: '30' },
        { nom: 'Ramipril', dosage: '10 mg', posologie: '1 cp 1x/jour', quantite: '30' },
      ],
      instructionsSpeciales: 'Surveiller la tension artérielle.',
    },
  ];

  const [searchTermNom, setSearchTermNom] = useState('');
  const [searchTermPrenom, setSearchTermPrenom] = useState('');
  const [searchTermCin, setSearchTermCin] = useState('');
  const [filteredOrdonnances, setFilteredOrdonnances] = useState(allOrdonnances);

  useEffect(() => {
    const results = allOrdonnances.filter(ordonnance => {
      return (
        ordonnance.patient.nom.toLowerCase().includes(searchTermNom.toLowerCase()) &&
        ordonnance.patient.prenom.toLowerCase().includes(searchTermPrenom.toLowerCase()) &&
        ordonnance.patient.cin.includes(searchTermCin)
      );
    });
    setFilteredOrdonnances(results);
  }, [searchTermNom, searchTermPrenom, searchTermCin]);

  const handleEffectuer = (ordonnanceId) => {
    alert(`Ordonnance ${ordonnanceId} marquée comme "Effectuée"`);
    // Ici, vous intégreriez la logique pour marquer l'ordonnance comme effectuée dans votre backend
  };

  const handleImprimer = (ordonnanceId) => {
    alert(`Impression de l'ordonnance ${ordonnanceId}`);
    // Ici, vous intégreriez la logique d'impression
    // Cela pourrait impliquer de générer un PDF ou d'ouvrir une fenêtre d'impression
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des Ordonnances</h1>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Nom du patient"
          value={searchTermNom}
          onChange={(e) => setSearchTermNom(e.target.value)}
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Prénom du patient"
          value={searchTermPrenom}
          onChange={(e) => setSearchTermPrenom(e.target.value)}
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="CIN du patient"
          value={searchTermCin}
          onChange={(e) => setSearchTermCin(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {filteredOrdonnances.length === 0 ? (
        <p style={styles.noResults}>Aucune ordonnance trouvée pour cette recherche.</p>
      ) : (
        filteredOrdonnances.map((ordonnance) => (
          <div key={ordonnance.id} style={styles.ordonnanceCard}>
            <h2 style={styles.ordonnanceId}>Ordonnance N°: {ordonnance.id}</h2>
            <p style={styles.dateEmission}>Date d'émission: {ordonnance.dateEmission}</p>

            <div style={styles.section}>
              <h3 style={styles.subtitle}>Informations Patient</h3>
              <p><strong>Nom:</strong> {ordonnance.patient.nom}</p>
              <p><strong>Prénom:</strong> {ordonnance.patient.prenom}</p>
              <p><strong>CIN:</strong> {ordonnance.patient.cin}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.subtitle}>Informations Médecin</h3>
              <p><strong>Nom:</strong> {ordonnance.medecin.nom}</p>
              <p><strong>Prénom:</strong> {ordonnance.medecin.prenom}</p>
              <p><strong>Spécialité:</strong> {ordonnance.medecin.specialite}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.subtitle}>Médicaments</h3>
              {ordonnance.medicaments.map((med, index) => (
                <div key={index} style={styles.medicamentItem}>
                  <p><strong>{med.nom}</strong> ({med.dosage})</p>
                  <p>Posologie: {med.posologie}</p>
                  <p>Quantité: {med.quantite}</p>
                </div>
              ))}
            </div>

            {ordonnance.instructionsSpeciales && (
              <div style={styles.section}>
                <h3 style={styles.subtitle}>Instructions Spéciales</h3>
                <p>{ordonnance.instructionsSpeciales}</p>
              </div>
            )}

            <div style={styles.actions}>
              <button
                onClick={() => handleEffectuer(ordonnance.id)}
                style={styles.buttonEffectuer}
              >
                Effectuer
              </button>
              <button
                onClick={() => handleImprimer(ordonnance.id)}
                style={styles.buttonImprimer}
              >
                Imprimer
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
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  },
  searchInput: {
    flex: '1',
    padding: '10px 15px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '1em',
  },
  noResults: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.1em',
    marginTop: '50px',
  },
  ordonnanceCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  ordonnanceId: {
    fontSize: '1.8em',
    color: '#3498db',
    marginBottom: '10px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
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
    border: '1px solid #e9ecef',
  },
  subtitle: {
    fontSize: '1.3em',
    color: '#2980b9',
    marginBottom: '10px',
    borderBottom: '1px solid #b3d9f7',
    paddingBottom: '5px',
  },
  medicamentItem: {
    marginBottom: '10px',
    paddingLeft: '10px',
    borderLeft: '4px solid #5dade2',
    backgroundColor: '#eaf6fd',
    padding: '8px',
    borderRadius: '4px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '25px',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '20px',
  },
  buttonEffectuer: {
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  buttonImprimer: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
};

export default OrdonnancesPage;

