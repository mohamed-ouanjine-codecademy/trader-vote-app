// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#0D47A1',  // Lighter blue in dark mode
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#E53935',  // Vivid red for accents
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#F5F5F5',
        paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 700 },
      h5: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            padding: '10px 20px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          },
        },
      },
    },
  });
