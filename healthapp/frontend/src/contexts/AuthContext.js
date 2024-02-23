import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook for easy context usage
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Here, you'd check for a user token in localStorage/sessionStorage
    // and possibly verify it with your backend to authenticate the user
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Function to handle login
  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
