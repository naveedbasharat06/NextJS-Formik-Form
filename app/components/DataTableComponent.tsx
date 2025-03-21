"use client";
import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import supabase from "../../utils/supabaseClient";
import FilterComponent from "./FilterComponent";
import { Box, CircularProgress } from "@mui/material";

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
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [filterText, setFilterText] = useState<string>("");

  const filteredItems = data.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.age && item.age.toString().toLowerCase().includes(filterText.toLowerCase()))
  );

  const fetchData = async (page, perPage) => {
    setLoading(true);

    try {
      // Calculate the range for pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      // Fetch data from Supabase
      const { data: fetchedData, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .range(from, to);

      setData(fetchedData || []);
      setTotalRows(count || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchData(page, perPage);
  }, [page, perPage]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  return (
    <>
      <Box
        sx={{
          height:"100vh",
          marginTop: 6,
          boxShadow: "0px 10px 30px rgba(0,0,255,0.4)",
          borderRadius: 2,
          p: 2,
          position: "relative", // Required for the absolute positioning of the spinner
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
            onFilter={(e) => setFilterText(e.target.value)}
          />

          <DataTable
       
            columns={columns}
            data={filteredItems}
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
          />
        </Box>
      </Box>
    </>
  );
};

export default DataTableComponent;