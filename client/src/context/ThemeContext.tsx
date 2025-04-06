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
      primary: '#2C3E50',     // Dark Slate Blue
      secondary: '#E67E22',   // Soft Orange
      background: '#F5F5F5',  // Light Gray
    },
    dark: {
      primary: '#ECF0F1',     // Off-White
      secondary: '#F39C12',   // Vibrant Amber
      background: '#121212',  // Deep Black
    },
  },
  streetwear: {
    light: {
      primary: '#1A1A1A',     // Charcoal Black
      secondary: '#FF3B3F',   // Hype Red
      background: '#F8F8F8',  // Light Gray
    },
    dark: {
      primary: '#EFEFEF',     // Almost White
      secondary: '#FF6B6B',   // Electric Coral
      background: '#0A0A0A',  // Near Black
    },
  },
  hiphop: {
    light: {
      primary: '#2D132C',     // Deep Burgundy
      secondary: '#FFD700',   // Gold
      background: '#F0F0F0',  // Soft Gray
    },
    dark: {
      primary: '#F5F5F5',     // Warm Light Grey
      secondary: '#C28800',   // Golden Bronze
      background: '#111111',  // Dark Gray
    },
  },
  indie: {
    light: {
      primary: '#8D99AE',     // Cool Gray Blue
      secondary: '#EF8354',   // Muted Orange
      background: '#F9F9F9',  // Very Light Gray
    },
    dark: {
      primary: '#2B2D42',     // Slate Blue-Black
      secondary: '#F1D302',   // Soft Mustard
      background: '#0D0D0D',  // Dark Slate
    },
  },
  punk: {
    light: {
      primary: '#D72638',     // Crimson Red
      secondary: '#1B1B1E',   // True Black
      background: '#EEEEEE',  // Light Gray
    },
    dark: {
      primary: '#E5E5E5',     // Dirty White
      secondary: '#FF2E63',   // Hot Pink/Red Hybrid
      background: '#000000',  // Absolute Black
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