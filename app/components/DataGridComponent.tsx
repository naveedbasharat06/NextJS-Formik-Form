"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Button, TextField } from "@mui/material";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";

interface DataGridComponentProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: string | number;
  locationText?: string | number;
  showButton?: boolean; // Optional prop to show/hide the button
  toggleDragableMarker?: () => void;
  showDragableMarker?: boolean;
  isGeolocateActive?: boolean;
  saveLocation?: () => void;
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
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const columnVisibilityModel = {
    shippingAddress: false,
    shippingName: false,
    latitude: false,
    longitude: false,
    id: isMobile ? false : true, // Hide ID column in mobile view
  };
  console.log("Column Visibility Model:", columnVisibilityModel);
  return (
    <Box
      sx={{
        borderRadius: 2,

        backgroundColor: "#ffffff",
        p: 2,
        margin: showButton ? 4 : 0,
        boxShadow: "0px 10px 30px rgba(0,0,255,0.4)",
      }}
    >
      {/* Conditionally render the button */}
      {showButton ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            marginBottom: 1,
          }}
        >
          <Button variant="contained" sx={{ background: "#003049" }}>
            <Link href="/addContactDetails">Add CONTACT</Link>
          </Button>
        </Box>
      ) : (
        <Box className="w-full flex items-center justify-between mb-2">
          <Box className="w-[calc(50%)] h-[70px] text-left overflow-hidden">
            {/* Ensure long text doesn't break the layout */}
            {locationText}
          </Box>
          <Box className="w-[50%] flex justify-end m-1">
            {/* Show "Save Location" button only if geolocation is active or draggable marker is visible */}
            {(showDragableMarker || isGeolocateActive) && (
              <Button
                onClick={saveLocation}
                sx={{
                  marginRight: 1,
                  padding: "8px 16px",
                  backgroundColor: "#003049",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#001f29",
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease-in-out",
                  },
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                Save Location
              </Button>
            )}

            {/* Toggle between "Add Location" and "Close Location" */}
            <Button
              onClick={toggleDragableMarker}
              sx={{
                padding: "8px 16px",
                backgroundColor: "#003049",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#001f29",
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease-in-out",
                },
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {showDragableMarker ? "Close Location" : "Add Location"}
            </Button>
          </Box>
        </Box>
      )}

      <DataGrid
        sx={{
          height: height,
          "& .super-app-theme--header": {
            backgroundColor: "#003049", // Dark header background
            color: "white",
          },

          // "& .MuiDataGrid-cell": {
          //   textAlign: "center", // Centering content in all cells
          // },
        }}
        rows={[...rows].sort((a, b) => b.id - a.id)}
        columns={columns}
        getRowClassName={() => "super-app-theme--row"} // Apply class to full row
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
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
};

export default DataGridComponent;
