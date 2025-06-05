import { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon,
  Bell,
  Moon, 
  Sun,
  Lock,
  Globe,
  Palette,
  Mail,
  Save
} from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: 'en',
    theme: 'light',
    notifications: true,
    emailNotifications: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'account', icon: <User size={18} />, label: 'Account' },
    { id: 'preferences', icon: <SettingsIcon size={18} />, label: 'Preferences' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-md text-left transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-500">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {saveSuccess && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              Settings saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={24} />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Globe size={16} />
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Palette size={16} />
                    Theme
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                        formData.theme === 'light' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                        formData.theme === 'dark' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Bell size={16} />
                      App Notifications
                    </h3>
                    <p className="text-xs text-gray-500">Receive notifications within the application</p>
                  </div>
                  <Toggle
                    checked={formData.notifications}
                    onChange={() => handleToggleChange('notifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} />
                      Email Notifications
                    </h3>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                  <Toggle
                    checked={formData.emailNotifications}
                    onChange={() => handleToggleChange('emailNotifications')}
                  />
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}