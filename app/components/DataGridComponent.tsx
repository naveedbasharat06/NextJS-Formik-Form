"use client";
import React, { useRef, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Button, Fade, useTheme } from "@mui/material";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import gsap from "gsap";


interface DataGridComponentProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: string | number;
  locationText?: string | number;
  showButton?: boolean;
  toggleDragableMarker?: () => void;
  showDragableMarker?: boolean;
  isGeolocateActive?: boolean;
  saveLocation?: () => void;
  showUserButton?: boolean;
  AddProductsButton?: boolean; // New prop for additional button
 // Handler for additional button click
}

const DataGridComponent: React.FC<DataGridComponentProps> = ({
  rows,
  columns,
  height,
  showButton = null,
  locationText,
  toggleDragableMarker,
  isGeolocateActive,
  showDragableMarker,
  saveLocation,
  showUserButton = false, // Default to false
  AddProductsButton = false, // Default to false
 // Handler for additional button click
}) => {
  const theme = useTheme(); // Access the theme
  const isMobile = useMediaQuery("(max-width: 768px)");
  const buttonRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const columnVisibilityModel = {
    shippingAddress: false,
    shippingName: false,
    latitude: false,
    longitude: false,
    product_code:false,
    manufacturer:false,
    warranty_period:false,
    shipping_weight:false,
    id: isMobile ? false : true, // Hide ID column in mobile view
  };

  const handleButtonClick = () => {
    const button = buttonRef.current;

    gsap.fromTo(
      button,
      {
        scale: 1,
        backgroundColor: theme.palette.secondary.main, // Use theme's primary color
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      },
      {
        scale: 1.1,
        backgroundColor: theme.palette.primary.dark, // Use theme's darker primary color
        boxShadow: "0px 0px 20px rgba(0, 0, 255, 0.5)",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        easein: "elastic.out(1, 0.3)",
      }
    );

    if (toggleDragableMarker) {
      toggleDragableMarker();
    }
  };

  const handleSaveLocation = () => {
    setSaving(true);
    saveLocation?.();
    setTimeout(() => setSaving(false), 1500); // Auto-hide animation after 1.5s
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper, // Use theme's background color
        p: 2,
        margin: showButton ? 4 : 0,
        boxShadow: "0px 10px 30px rgba(0,0,255,0.4)", // Use theme's shadow
      }}
    >
      {/* Conditionally render buttons based on showUserButton */}
      {!showUserButton && (
        <>
          {showButton ? (
            <Box sx={{ display: "flex", justifyContent: "end", marginBottom: 1 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: theme.palette.secondary.main }} // Use theme's primary color
              >
                <Link
                  href="/addContactDetails"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Add CONTACT
                </Link>
              </Button>
            </Box>
          ) : (
            <Box className="w-full flex items-center justify-between mb-2">
              <Box
                className="w-[calc(50%)] h-[70px] text-left overflow-hidden"
                sx={{ color: theme.palette.text.primary }}
              >
                {locationText}
              </Box>
              <Box className="w-[50%] flex justify-end m-1">
                {/* Only show these buttons if showAdditionalButton is false */}
                {!AddProductsButton && (
                  <>
                    <Fade in={showDragableMarker || isGeolocateActive}>
                      <Button
                      
                        sx={{
                          marginRight: 1,
                          padding: "8px 16px",
                          backgroundColor: saving
                            ? "#38b000"
                            : theme.palette.secondary.main, // Use theme's primary color
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark, // Use theme's darker primary color
                            transform: "scale(1.05)",
                            transition: "transform 0.2s ease-in-out",
                          },
                          boxShadow: saving
                            ? "0px 0px 20px rgba(56, 176, 0, 0.8)"
                            : theme.shadows[3], // Use theme's shadow
                          transition:
                            "background-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                      >
                        {saving ? "Location Saved!" : "Save Location"}
                      </Button>
                    </Fade>

                    <Button
                      ref={buttonRef}
                      onClick={handleButtonClick}
                      sx={{
                        padding: "8px 16px",
                        backgroundColor: theme.palette.secondary.main, // Use theme's primary color
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark, // Use theme's darker primary color
                          transform: "scale(1.05)",
                          transition: "transform 0.2s ease-in-out",
                        },
                        boxShadow: theme.shadows[3], // Use theme's shadow
                      }}
                    >
                      {showDragableMarker ? "Close Location" : "Add Location"}
                    </Button>
                  </>
                )}

                {/* Conditionally render the additional button */}
                {AddProductsButton && (
                  <Link href={"./addProducts"}>
          
                  <Button
                  
                    sx={{
                      marginLeft: 1,
                      padding: "8px 16px",
                      backgroundColor: theme.palette.secondary.main, // Use theme's primary color
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark, // Use theme's darker primary color
                        transform: "scale(1.05)",
                        transition: "transform 0.2s ease-in-out",
                      },
                      boxShadow: theme.shadows[3], // Use theme's shadow
                    }}
                  >
                    NEW PRODUCT
                  </Button>
                  </Link>
                )}
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Render the DataGrid */}
      <DataGrid
        sx={{
          height: height,
          "& .super-app-theme--header": {
            backgroundColor: theme.palette.secondary.main, // Use theme's primary color
            color: theme.palette.primary.contrastText, // Use theme's contrast text color
          },
        }}
        rows={[...rows].sort((a, b) => b.id - a.id)}
        columns={columns}
        getRowClassName={() => "super-app-theme--row"}
        initialState={{
          columns: {
            columnVisibilityModel,
          },
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableColumnFilter
        disableDensitySelector
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
      />
    </Box>
  );
};

export default DataGridComponent;