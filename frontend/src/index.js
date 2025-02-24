// frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n'; // i18n configuration
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import { AuthProvider } from './context/AuthContext';

const defaultMode = localStorage.getItem('themeMode') || 'light';
const theme = getTheme(defaultMode);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
