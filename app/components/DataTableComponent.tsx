"use client";
import React, { useState, useEffect, useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import supabase from "../utils/supabaseClient";
import FilterComponent from "./FilterComponent";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const columns: TableColumn<User>[] = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Age",
    selector: (row) => row.age,
    sortable: true,
  },
];

const DataTableComponent = () => {
  const theme = useTheme();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [filterText, setFilterText] = useState<string>("");

  // Fetch data function
  const fetchData = async (
    page: number,
    perPage: number,
    filterText: string
  ) => {
    setLoading(true);

    try {
      // Calculate the range for pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      // Validate age filter
      let ageFilter = "";
      if (!isNaN(parseInt(filterText, 10))) {
        ageFilter = `age.eq.${parseInt(filterText, 10)}`;
      }

      // Build the query
      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .range(from, to);

      // Add search filter if filterText is provided
      if (filterText) {
        query = query.or(
          `name.ilike.%${filterText}%,email.ilike.%${filterText}%${
            ageFilter ? `,${ageFilter}` : ""
          }`
        );
      }

      // Execute the query
      const { data: fetchedData, count, error } = await query;

      if (error) {
        throw error;
      }

      setData(fetchedData || []);
      setTotalRows(count || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Fetch data when page or perPage changes
  useEffect(() => {
    fetchData(page, perPage, filterText);
  }, [page, perPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Handle rows per page change
  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  // Handle filter input change
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(e.target.value);
    },
    []
  );

  // Handle search button click
  const handleSearch = () => {
    // Reset to the first page when searching
    setPage(1);
    fetchData(1, perPage, filterText);
  };

  return (
    <>
      <Typography
        sx={{
          marginTop: 4,
          fontSize: "2.5rem", // Larger font size for better visibility
          fontWeight: "bold", // Bold text
          color: (theme) => theme.palette.primary.main, // Use theme's primary color
          textAlign: "center", // Center align the text
          textTransform: "uppercase", // Uppercase text
          letterSpacing: "0.15em", // Increased letter spacing for emphasis
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)", // Add a shadow effect for depth
          transition: "color 0.3s, transform 0.3s", // Smooth transitions
          "&:hover": {
            color: (theme) => theme.palette.secondary.main, // Use theme's secondary color on hover
            transform: "scale(1.05)", // Slight scaling effect on hover
          },
        }}
      >
        DATA TABLE
      </Typography>
      <Box
        sx={{
          height: "100vh",
          marginTop: 2,
          boxShadow: "0px 10px 30px rgba(0,0,255,0.4)",
          borderRadius: 2,
          p: 2,
          position: "relative", // Required for the absolute positioning of the spinner
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Loading Spinner Overlay */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999, // Ensure it's on top of everything
              borderRadius: 2, // Match the border radius of the parent Box
              // Semi-transparent background
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        )}

        {/* Hide FilterComponent and DataTable when loading */}
        <Box
          sx={{
            visibility: loading ? "hidden" : "visible", // Hide content when loading
            opacity: loading ? 0 : 1, // Fade out content when loading
            transition: "opacity 0.3s ease", // Smooth transition
          }}
        >
          <FilterComponent
            filterText={filterText}
            onFilter={handleFilterChange}
            onSearch={handleSearch} // Pass handleSearch to FilterComponent
          />

          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            highlightOnHover
            striped
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              },
              rows: {
                style: {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "&.rdt_TableRow--selected": {
                    backgroundColor: theme.palette.action.selected,
                    color: theme.palette.primary.contrastText,
                  },
                },
              },
              pagination: {
                style: {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderTop: `1px solid ${theme.palette.divider}`,
                },
                pageButtonsStyle: {
                  color: theme.palette.primary.main,
                  fill: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "&:focus": {
                    outline: "none",
                    backgroundColor: theme.palette.action.selected,
                  },
                },
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default DataTableComponent;
