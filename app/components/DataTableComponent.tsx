"use client";
import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Box, useTheme, Typography, CircularProgress } from '@mui/material';
import { fetchUsers, User } from '../services/Services';

// Define columns
const columns: TableColumn<User>[] = [
  {
    name: 'ID',
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Email',
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: 'Age',
    selector: (row) => row.age,
    sortable: true,
  },
];

const DataTableComponent: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();


  const fetchData = async (page: number, perPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data: fetchedData, count } = await fetchUsers(page, perPage);
      setData(fetchedData || []);
      setTotalRows(count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, perPage);
  }, [page, perPage]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  return (
    <>
    {loading?   <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height
                width: "100vw",
              }}
            >
              <CircularProgress size={60} thickness={4} />
              </Box> :     <Box
      sx={{
        borderRadius: 2,
        margin: 4,
        boxShadow: theme.shadows[5], // Use theme's shadow
        backgroundColor: theme.palette.background.paper, // Use theme's background color
        padding: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, color: theme.palette.text.primary }}>
        User Data
      </Typography>

      {/* {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )} */}

      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
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
              }

    </>
  );
};

export default DataTableComponent;