// components/DataGridComponent.tsx
"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Link from "next/link";

interface DataGridComponentProps {
  rows: GridRowsProp;
  columns: GridColDef[];
}

const DataGridComponent: React.FC<DataGridComponentProps> = ({
  rows,
  columns,
}) => {
  return (
    <>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          p: 2,
        }}
      > */}
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#ffffff",
          p: 2,
        }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              marginBottom: 1,
            }}
          >
            <Button variant="contained">
              <Link href="/addContactDetals">Add CONTACT</Link>
            </Button>
          </Box>
          <DataGrid
            sx={{
              height: "110vh",
              "& .super-app-theme--header": {
                backgroundColor: "rgb(25, 117, 209)",
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
        </>
      </Box>
      {/* </Box> */}
    </>
  );
};

export default DataGridComponent;
