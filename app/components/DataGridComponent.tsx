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

interface DataGridComponentProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: string | number;
  locationText?: string | number;
  showButton?: boolean; // Optional prop to show/hide the button
}

const DataGridComponent: React.FC<DataGridComponentProps> = ({
  rows,
  columns,
  height = "115vh",
  showButton = null,
  locationText, // Default is true
}) => {
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
          <Button variant="contained">
            <Link href="/addContactDetails">Add CONTACT</Link>
          </Button>
        </Box>
      ) : (
        <Box className="w-full flex justify-end mb-2">
          <TextField
            // fullWidth
            label="Your Location Address"
            value={locationText}
            variant="outlined"
            className="w-[50%] "
            InputProps={{
              readOnly: true, // Make it read-only
            }}
          />
        </Box>
      )}

      <DataGrid
        sx={{
          height: height,
          "& .super-app-theme--header": {
            backgroundColor: "rgb(117, 117, 117)",
            color: "white",
          },
        }}
        rows={[...rows].sort((a, b) => b.id - a.id)}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
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
