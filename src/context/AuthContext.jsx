import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // State to hold user information, including roles
  const [user, setUser] = useState({});

  // State to manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate fetching user data from an API or local storage on component mount
  useEffect(() => {
    // Dummy data for demonstration purposes
    // Replace this with actual data fetching logic (e.g., from an API or local storage)
    const fetchedUserData = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Admin', // Example role; this could be dynamically set
    };

    // Update the state with the fetched user data
    setUser(fetchedUserData);
    setIsAuthenticated(true); // Simulate successful authentication
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
