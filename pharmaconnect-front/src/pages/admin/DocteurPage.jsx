import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    cin: '',
    specialite: ''
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/doctors');
      setDoctors(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      console.error('Erreur chargement médecins:', err);
      setError('Erreur lors du chargement des médecins');
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const addDoctor = async () => {
    const { nom, prenom, email, motDePasse, cin, specialite } = newDoctor;

    if (!nom || !prenom || !email || !motDePasse || !cin || !specialite) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/doctors', {
        firstName: prenom,
        lastName: nom,
        email,
        password: motDePasse,
        cin,
        specialty: specialite
      });

      if (response.data.doctor) {
        setDoctors([response.data.doctor, ...doctors]);
        setMessage('Médecin ajouté avec succès');
        setNewDoctor({
          nom: '',
          prenom: '',
          email: '',
          motDePasse: '',
          cin: '',
          specialite: ''
        });
      } else {
        setError('Erreur: Réponse du serveur incomplète');
      }
    } catch (err) {
      console.error('Erreur ajout médecin:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du médecin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDoctorToDelete(id);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/doctors/${doctorToDelete}`);
      setDoctors(doctors.filter(doc => doc.id !== doctorToDelete));
      setMessage('Médecin supprimé avec succès');
      setError('');
      setDialogOpen(false);
      setDoctorToDelete(null);
    } catch (err) {
      console.error('Erreur suppression médecin:', err);
      setError('Erreur lors de la suppression du médecin');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const response = await axios.put(`/api/doctors/${id}/status`, { active: !currentStatus });
      if (response.data.doctor) {
        setDoctors(doctors.map(doc =>
          doc.id === id ? response.data.doctor : doc
        ));
        setMessage(`Statut du médecin ${!currentStatus ? 'activé' : 'désactivé'}`);
        setError('');
      }
    } catch (err) {
      console.error('Erreur changement statut médecin:', err);
      setError('Erreur lors du changement de statut');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Médecins</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-[#1D10FA] text-[#1D10FA] rounded-md">
          {error}
        </div>
      )}

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau médecin</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Input placeholder="Nom" value={newDoctor.nom} onChange={(e) => setNewDoctor({ ...newDoctor, nom: e.target.value })} />
            <Input placeholder="Prénom" value={newDoctor.prenom} onChange={(e) => setNewDoctor({ ...newDoctor, prenom: e.target.value })} />
            <Input placeholder="Email" type="email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
            <Input placeholder="Mot de passe" type="password" value={newDoctor.motDePasse} onChange={(e) => setNewDoctor({ ...newDoctor, motDePasse: e.target.value })} />
            <Input placeholder="CIN" value={newDoctor.cin} onChange={(e) => setNewDoctor({ ...newDoctor, cin: e.target.value })} />
            <Input placeholder="Spécialité" value={newDoctor.specialite} onChange={(e) => setNewDoctor({ ...newDoctor, specialite: e.target.value })} />
            <div className="md:col-span-3">
              <Button onClick={addDoctor} className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? 'Ajout en cours...' : 'Ajouter le médecin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(doctors) && doctors.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{doc.nom} {doc.prenom}</h2>
              <div className="space-y-2 mb-4">
                <p><strong>Email:</strong> {doc.email}</p>
                <p><strong>CIN:</strong> {doc.cin}</p>
                <p><strong>Spécialité:</strong> {doc.specialty}</p>
                <p className={`text-sm font-medium ${doc.is_active ? 'text-green-600' : 'text-red-500'}`}>
                  {doc.is_active ? 'Actif' : 'Désactivé'}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="secondary" onClick={() => toggleActive(doc.id, doc.is_active)}>
                  {doc.is_active ? 'Désactiver' : 'Activer'}
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteClick(doc.id)}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        message="Êtes-vous sûr de vouloir supprimer ce médecin ?"
      />
    </div>
  );
}
