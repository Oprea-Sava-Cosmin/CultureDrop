import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define theme types
type ThemeMode = 'light' | 'dark';
export type CultureTheme = 'urban' | 'streetwear' | 'hiphop' | 'indie' | 'punk';

// Define theme context type
interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  culture: CultureTheme;
  setCulture: (culture: CultureTheme) => void;
}

// Create theme context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleMode: () => {},
  culture: 'urban',
  setCulture: () => {},
});

// Define culture-specific theme palettes
const cultureThemes = {
  urban: {
    light: {
      primary: '#3f51b5',
      secondary: '#f50057',
      background: '#f5f5f5',
    },
    dark: {
      primary: '#5c6bc0',
      secondary: '#ff4081',
      background: '#121212',
    },
  },
  streetwear: {
    light: {
      primary: '#ff9800',
      secondary: '#2196f3',
      background: '#f8f8f8',
    },
    dark: {
      primary: '#ffa726',
      secondary: '#42a5f5',
      background: '#0a0a0a',
    },
  },
  hiphop: {
    light: {
      primary: '#9c27b0',
      secondary: '#ffeb3b',
      background: '#f0f0f0',
    },
    dark: {
      primary: '#ba68c8',
      secondary: '#fff176',
      background: '#111111',
    },
  },
  indie: {
    light: {
      primary: '#4caf50',
      secondary: '#e91e63',
      background: '#f9f9f9',
    },
    dark: {
      primary: '#66bb6a',
      secondary: '#ec407a',
      background: '#0d0d0d',
    },
  },
  punk: {
    light: {
      primary: '#f44336',
      secondary: '#212121',
      background: '#eeeeee',
    },
    dark: {
      primary: '#ef5350',
      secondary: '#424242',
      background: '#000000',
    },
  },
};

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Get stored theme preferences or use defaults
  const [mode, setMode] = useState<ThemeMode>(() => {
    const storedMode = localStorage.getItem('themeMode');
    return (storedMode as ThemeMode) || 'dark';
  });
  
  const [culture, setCulture] = useState<CultureTheme>(() => {
    const storedCulture = localStorage.getItem('culturePalette');
    return (storedCulture as CultureTheme) || 'urban';
  });

  // Toggle between light and dark mode
  const toggleMode = () => {
    console.log('Toggle mode called');
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Update culture theme
  const handleSetCulture = (newCulture: CultureTheme) => {
    setCulture(newCulture);
  };

  // Store theme preferences in localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('culturePalette', culture);
  }, [mode, culture]);

  // Create MUI theme based on current preferences
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: cultureThemes[culture][mode].primary,
      },
      secondary: {
        main: cultureThemes[culture][mode].secondary,
      },
      background: {
        default: cultureThemes[culture][mode].background,
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 4px 12px rgba(0,0,0,0.05)' 
              : '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleMode,
        culture,
        setCulture: handleSetCulture,
      }}
    >
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);