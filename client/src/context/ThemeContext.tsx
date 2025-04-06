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

// Define culture-specific fonts
const cultureFonts = {
  urban: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
  streetwear: '"Anton", "Roboto", "Helvetica", "Arial", sans-serif',
  hiphop: '"Bebas Neue", "Roboto", "Helvetica", "Arial", sans-serif',
  indie: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
  punk: '"Rubik Mono One", "Roboto", "Helvetica", "Arial", sans-serif',
};

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
      fontFamily: cultureFonts[culture], // Apply the culture-specific font
      h1: {
        fontFamily: cultureFonts[culture],
        lineHeight: culture === 'hiphop' ? 1.2 : 1.2,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
      },
      h2: {
        fontFamily: cultureFonts[culture],
        lineHeight: culture === 'hiphop' ? 1.2 : 1.2,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
        marginBottom: culture === 'hiphop' ? '0.3em' : undefined,
      },
      h3: {
        fontFamily: cultureFonts[culture],
        lineHeight: culture === 'hiphop' ? 1.2 : 1.2,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
      },
      h4: {
        fontFamily: cultureFonts[culture],
        lineHeight: culture === 'hiphop' ? 1.2 : 1.2,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
      },
      h5: {
        fontFamily: cultureFonts[culture],
        lineHeight: culture === 'hiphop' ? 1.2 : 1.2,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
        marginBottom: culture === 'hiphop' ? '0.5em' : undefined,
      },
      h6: {
        fontFamily: cultureFonts[culture],
        lineHeight: culture === 'hiphop' ? 1.2 : 1.2,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
      },
      button: {
        fontFamily: cultureFonts[culture],
        textTransform: 'none', // Prevent uppercase transformation
        fontWeight: culture === 'punk' || culture === 'streetwear' ? 400 : 500,
        letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
        lineHeight: 1.2,
      },
      body1: {
        fontFamily: cultureFonts[culture],
        lineHeight: 1.6,
        letterSpacing: culture === 'hiphop' ? '0.03em' : 'normal',
        marginBottom: culture === 'hiphop' ? '0.5em' : undefined,
      },
      body2: {
        fontFamily: cultureFonts[culture],
        lineHeight: 1.6,
        letterSpacing: culture === 'hiphop' ? '0.03em' : 'normal',
        marginBottom: culture === 'hiphop' ? '0.5em' : undefined,
      },
      subtitle1: {
        fontFamily: cultureFonts[culture],
        lineHeight: 1.5,
        letterSpacing: culture === 'hiphop' ? '0.04em' : 'normal',
        marginBottom: culture === 'hiphop' ? '0.5em' : undefined,
      },
      subtitle2: {
        fontFamily: cultureFonts[culture],
        lineHeight: 1.5,
        letterSpacing: culture === 'hiphop' ? '0.04em' : 'normal',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: culture === 'hiphop' ? '8px 16px 6px' : undefined, // Adjust padding for Bebas Neue
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          label: {
            // Adjust chip label alignment for different fonts
            lineHeight: culture === 'hiphop' ? 1.4 : 1.4,
            padding: culture === 'hiphop' ? '0 8px' : undefined,
            letterSpacing: culture === 'hiphop' ? '0.05em' : undefined,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: culture === 'hiphop' ? '16px 16px 8px' : undefined,
            '&:last-child': {
              paddingBottom: culture === 'hiphop' ? '16px' : undefined,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            marginBottom: culture === 'hiphop' ? '0.5em' : undefined,
          },
          gutterBottom: {
            marginBottom: culture === 'hiphop' ? '0.8em' : '0.35em',
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