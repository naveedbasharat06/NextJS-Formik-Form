"use client";
import React, { createContext, useContext, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { store } from "../store/store";
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
      fontFamily: '"Inter"', // Global font
    },
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#535C91" : "#1B1A55", // Primary color
      },
      secondary: {
        main: mode === "dark" ? "#9290C3" : "#535C91", // Secondary color
      },
      background: {
        default: mode === "dark" ? "#070F2B" : "#F5F5F5", // Background color
        paper: mode === "dark" ? "#1B1A55" : "#FFFFFF", // Paper color
      },
      text: {
        primary: mode === "dark" ? "#FFFFFF" : "#000000", // Primary text color
        secondary: mode === "dark" ? "#9290C3" : "#535C91", // Secondary text color
      },
    },
    components: {
      // Global styles for TextField
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: mode === "dark" ? "#535C91" : "#1B1A55", // Border color
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#9290C3" : "#535C91", // Hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#9290C3" : "#1B1A55", // Focus border color
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === "dark" ? "#9290C3" : "#1B1A55", // Label color
            },
            "&:hover .MuiInputLabel-root": {
              color: mode === "dark" ? "#FFFFFF" : "#535C91", // Hover label color
            },
          },
        },
      },
      // Global styles for Checkbox
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#9290C3" : "#1B1A55", // Checkbox color
            "&.Mui-checked": {
              color: mode === "dark" ? "#9290C3" : "#535C91", // Checked state color
            },
          },
        },
      },
      // Global styles for DataGrid
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .super-app-theme--header": {
              backgroundColor: mode === "dark" ? "#1B1A55" : "#535C91", // Header background
              color: mode === "dark" ? "#FFFFFF" : "#FFFFFF", // Header text color
            },
            "& .MuiDataGrid-row": {
              color: mode === "dark" ? "#FFFFFF" : "#000000", // Row text color
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${
                mode === "dark" ? "#535C91" : "#E0E0E0"
              }`, // Cell border
            },
            // Toolbar styles
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: mode === "dark" ? "#070F2B" : "#F5F5F5", // Toolbar background
              color: mode === "dark" ? "#FFFFFF" : "#000000", // Toolbar text color
              "& .MuiButton-root": {
                color: mode === "dark" ? "#FFFFFF" : "#000000", // Button text color
              },
              "& .MuiInputBase-root": {
                color: mode === "dark" ? "#FFFFFF" : "#000000", // Input text color
                "& .MuiSvgIcon-root": {
                  color: mode === "dark" ? "#FFFFFF" : "#000000", // Icon color
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
