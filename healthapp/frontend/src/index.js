// Import the React and ReactDom libraries
import React from "react";
import { createRoot } from 'react-dom/client'; // Corrected import
import { App } from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import { AuthProvider } from './contexts/AuthContext';

// Correct usage of createRoot
const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
