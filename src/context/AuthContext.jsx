import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from session storage if available
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!Object.keys(user).length);

  useEffect(() => {
    // Sync user with sessionStorage on user change
    if (Object.keys(user).length > 0) {
      sessionStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};