import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Lock, Edit, Save, X } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const adminId = 1; // Remplace avec l'ID dynamique si nécessaire

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/${adminId}`);
        const admin = res.data;
        setFormData({
          name: admin.full_name || '',
          email: admin.email || '',
          phone: admin.phone || '',
          address: admin.address || '',
        });
      } catch (err) {
        console.error('Erreur chargement profil admin :', err);
      }
    };

    fetchAdmin();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (isEditing && passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/api/admin/${adminId}`, {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });

      if (passwordData.newPassword) {
        await axios.put(`http://localhost:5000/api/admin/${adminId}/change-password`, {
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        });
      }

      setSuccessMessage('✅ Profil mis à jour avec succès');
      setIsEditing(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.response?.data?.error || '❌ Erreur lors de la mise à jour' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6" />
          My Profile
        </h1>

        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit size={16} /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="flex items-center gap-2"
            >
              <X size={16} /> Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex items-center gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        )}
      </div>

      {successMessage && <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md">{successMessage}</div>}
      {errors.submit && <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">{errors.submit}</div>}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputField label="Full Name" name="name" icon={<User size={16} />} value={formData.name} error={errors.name} onChange={handleInputChange} disabled={!isEditing} />
            <InputField label="Email Address" name="email" icon={<Mail size={16} />} value={formData.email} error={errors.email} onChange={handleInputChange} disabled={!isEditing} />
            <InputField label="Phone Number" name="phone" icon={<Phone size={16} />} value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
            <InputField label="Address" name="address" icon={<MapPin size={16} />} value={formData.address} onChange={handleInputChange} disabled={!isEditing} />
          </div>

          {isEditing && (
            <div className="border-t pt-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Lock size={18} /> Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PasswordField label="Current Password" name="currentPassword" value={passwordData.currentPassword} error={errors.currentPassword} onChange={handlePasswordChange} />
                <PasswordField label="New Password" name="newPassword" value={passwordData.newPassword} error={errors.newPassword} onChange={handlePasswordChange} />
                <PasswordField label="Confirm New Password" name="confirmPassword" value={passwordData.confirmPassword} error={errors.confirmPassword} onChange={handlePasswordChange} />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const InputField = ({ label, name, icon, value, onChange, error, disabled }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">{icon}{label}</label>
    {disabled ? (
      <p className="p-2 text-gray-900">{value || 'Not provided'}</p>
    ) : (
      <>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </>
    )}
  </div>
);

const PasswordField = ({ label, name, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
