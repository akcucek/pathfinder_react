import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced user database with more realistic data
const users = [
  { 
    id: 1, 
    identifier: 'admin', 
    email: 'admin@company.com',
    password: 'admin123', 
    role: 'admin',
    name: 'Admin User',
    department: 'IT',
    lastLogin: null,
    isActive: true,
    permissions: ['read', 'write', 'delete', 'manage_users', 'generate_reports', 'admin_panel']
  },
  { 
    id: 2, 
    identifier: 'user', 
    email: 'user@company.com',
    password: 'user123', 
    role: 'user',
    name: 'Regular User',
    department: 'Business',
    lastLogin: null,
    isActive: true,
    permissions: ['read', 'write', 'generate_reports']
  },
  { 
    id: 3, 
    identifier: 'manager', 
    email: 'manager@company.com',
    password: 'manager123', 
    role: 'manager',
    name: 'Manager User',
    department: 'Management',
    lastLogin: null,
    isActive: true,
    permissions: ['read', 'write', 'generate_reports', 'approve_requests']
  },
  { 
    id: 4, 
    identifier: 'analyst', 
    email: 'analyst@company.com',
    password: 'analyst123', 
    role: 'analyst',
    name: 'Business Analyst',
    department: 'Analysis',
    lastLogin: null,
    isActive: true,
    permissions: ['read', 'write', 'generate_reports', 'ba_approval']
  }
];

// SSO Configuration (mock)
const ssoConfig = {
  enabled: true,
  provider: 'Corporate SSO',
  loginUrl: '/auth/sso',
  logoutUrl: '/auth/sso/logout'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('authUser');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      
      if (storedUser && isLoggedIn === 'true') {
        try {
          const userData = JSON.parse(storedUser);
          const expiryTime = new Date(sessionExpiry);
          
          // Check if session is still valid
          if (expiryTime > new Date()) {
            setUser(userData);
            setIsAuthenticated(true);
            startSessionTimer(expiryTime);
          } else {
            // Session expired
            logout();
          }
        } catch (error) {
          // Error parsing stored user data - logout for security
          logout();
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Session timer management
  const startSessionTimer = (expiryTime) => {
    if (!expiryTime || typeof expiryTime.getTime !== 'function') {
      console.warn('Session timer not started: expiryTime is invalid');
      return;
    }
    const timeLeft = expiryTime.getTime() - new Date().getTime();
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        alert('Your session has expired. Please log in again.');
        logout();
      }, timeLeft);
      setSessionTimeout(timer);
    }
  };

  // Standard login - POC MODE (Authentication bypassed)
  const login = async (identifier, password, rememberMe = false, setErrorCallback) => {
    setLoading(true);
    try {
      // POC: Bypass authentication since it's not implemented in backend yet
      console.log('POC Mode: Bypassing authentication for:', identifier);
      // Simulate a successful login with mock user data
      const mockUser = {
        id: '1',
        name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
        role: identifier.toLowerCase().includes('admin') ? 'admin' : 'user',
        avatar: null
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('authUser', JSON.stringify(mockUser));
      }
      // Set session timeout for security (optional in POC)
      if (!rememberMe) {
        // Use a default session duration for POC
        const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
        const expiryTime = new Date(Date.now() + sessionDuration);
        startSessionTimer(expiryTime);
      }
      setLoading(false);
      return { success: true, user: mockUser };
    } catch (err) {
      console.error('POC Login simulation error:', err);
      if (typeof setErrorCallback === 'function') {
        setErrorCallback(err.message || 'Login simulation failed');
      }
      setLoading(false);
      throw err;
    }
  };

  // SSO login simulation
  const loginWithSSO = async () => {
    setLoading(true);
    
    try {
      // Simulate SSO redirect and callback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful SSO response
      const ssoUser = {
        id: 100,
        identifier: 'sso_user',
        email: 'sso.user@company.com',
        role: 'user',
        name: 'SSO User',
        department: 'External',
        lastLogin: new Date().toISOString(),
        permissions: ['read', 'write'],
        ssoProvider: 'Corporate SSO'
      };

      // Set session expiry (SSO sessions typically last longer)
      const sessionDuration = 4 * 60 * 60 * 1000; // 4 hours
      const expiryTime = new Date(Date.now() + sessionDuration);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authUser', JSON.stringify(ssoUser));
      localStorage.setItem('sessionExpiry', expiryTime.toISOString());

      setUser(ssoUser);
      setIsAuthenticated(true);
      startSessionTimer(expiryTime);
      setLoading(false);

      return { success: true, user: ssoUser };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'SSO authentication failed. Please try again.' };
    }
  };

  const logout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authUser');
    localStorage.removeItem('sessionExpiry');
    setUser(null);
    setIsAuthenticated(false);
    setSessionTimeout(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const extendSession = () => {
    if (isAuthenticated) {
      const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
      const expiryTime = new Date(Date.now() + sessionDuration);
      
      localStorage.setItem('sessionExpiry', expiryTime.toISOString());
      
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      startSessionTimer(expiryTime);
    }
  };

  const getSessionTimeLeft = () => {
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (sessionExpiry) {
      const expiryTime = new Date(sessionExpiry);
      const timeLeft = expiryTime.getTime() - new Date().getTime();
      return Math.max(0, timeLeft);
    }
    return 0;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithSSO,
    logout,
    updateUser,
    hasRole,
    hasPermission,
    extendSession,
    getSessionTimeLeft,
    ssoConfig
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
