"use client";
import React, { createContext, useContext, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from 'react-redux';
import { store } from '../store/store';
// Extend the MUI theme to include MuiDataGrid
import { Theme, Components } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        root?: {
          // Define your custom styles here
        };
      };
    };
  }
}

// Define the theme context
const ThemeContext = createContext<{
  mode: "light" | "dark";
  toggleTheme: () => void;
}>({
  mode: "light",
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme creation function
const getTheme = (mode: "light" | "dark") =>
  createTheme({
    typography: {
      fontFamily: '" Inter"', // Global font
    },
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#121212" : "#003049", // Dynamic primary color
      },
      secondary: {
        main: mode === "dark" ? "#3C3D37" : "#003049",
      },

      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000", // Dynamic text color
      },
    },
    components: {
      // Global styles for TextField
      MuiTextField: {
        styleOverrides: {
          root:
            mode === "dark"
              ? {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#f0f0f0", // Fixed border color
                    },
                    // Remove hover and focus effects
                    "&:hover fieldset": {
                      borderColor: "#f0f0f0", // Same as default
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#f0f0f0", // Same as default
                    },
                  },
                  "&:hover .MuiInputLabel-root": {
                    color: "#ffffff", // Dynamic label color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#ffffff",
                  },
                }
              : {},
        },
      },
      // Global styles for Checkbox
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#ffffff" : "#000000", // Checkbox color
            "&.Mui-checked": {
              color: mode === "dark" ? "#ffffff" : "#000000", // Checked state color
            },
          },
        },
      },
      // Global styles for DataGrid
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .super-app-theme--header": {
              backgroundColor: mode === "dark" ? "#3C3D37" : "#003049", // Header background
              color: mode === "dark" ? "#ffffff" : "#ffffff", // Header text color
            },
            "& .MuiDataGrid-row": {
              color: mode === "dark" ? "#ffffff" : "#000000", // Row text color
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${
                mode === "dark" ? "#555555" : "#e0e0e0"
              }`, // Cell border
            },
            // Toolbar styles
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5", // Toolbar background
              color: mode === "dark" ? "#ffffff" : "#000000", // Toolbar text color
              "& .MuiButton-root": {
                color: mode === "dark" ? "#ffffff" : "#000000", // Button text color
              },
              "& .MuiInputBase-root": {
                color: mode === "dark" ? "#ffffff" : "#000000", // Input text color
                "& .MuiSvgIcon-root": {
                  color: mode === "dark" ? "#ffffff" : "#000000", // Icon color
                },
              },
            },
          },
        },
      },
    },
  });

// ThemeRegistry component
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Function to toggle between light and dark modes
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
      <Provider store={store}>
       <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
      </Provider> 
  );
}
