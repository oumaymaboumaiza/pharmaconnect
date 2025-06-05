import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
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
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

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
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
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
      const updateData = { ...formData };
      if (passwordData.newPassword) {
        updateData.currentPassword = passwordData.currentPassword;
        updateData.newPassword = passwordData.newPassword;
      }

      await updateProfile(updateData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
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
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </>
              ) : (
                <p className="p-2 text-gray-900">{formData.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </>
              ) : (
                <p className="p-2 text-gray-900">{formData.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="p-2 text-gray-900">{formData.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin size={16} />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="p-2 text-gray-900">{formData.address || 'Not provided'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="border-t pt-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Lock size={18} />
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-xs">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}