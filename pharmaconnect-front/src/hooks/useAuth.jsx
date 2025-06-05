import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@pharmaconnect.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
  },
  {
    id: '2',
    email: 'pharmacy@pharmaconnect.com',
    password: 'pharmacy123',
    name: 'Pharmacy Manager',
    role: 'PHARMACY',
  },
  {
    id: '3',
    email: 'doctor@pharmaconnect.com',
    password: 'doctor123',
    name: 'Dr. Smith',
    role: 'DOCTOR',
  },
  {
    id: '4',
    email: 'supplier@pharmaconnect.com',
    password: 'supplier123',
    name: 'Medical Supplier Inc.',
    role: 'SUPPLIER',
  },
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // This is a mock implementation - in a real app, you'd call your API
      // Using setTimeout to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Create a mock token
      const token = `mock_token_${Math.random().toString(36).substring(2)}`;
      
      // Remove password from user data
      const { password: _, ...userWithoutPassword } = user;
      
      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        user: userWithoutPassword,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        login,
        logout,
        error: authState.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};