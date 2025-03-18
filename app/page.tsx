"use client";
import React, { useEffect, useState } from "react";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import supabase from "../utils/supabaseClient";
import DataGridComponent from "./components/DataGridComponent";
import EditModalComponent from "./components/EditModalComponent";
import DeleteModalComponent from "./components/DeleteModalComponent";
import { getColumns } from "./constants/datagridColumnsName";
import SuccessSnackbar from "./components/SuccessSnackbar";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { motion } from "framer-motion";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

// Define a proper interface for the form data
interface FormData {
  id: number;
  name: string;
  address: string;
  shippingName: string;
  shippingAddress: string;
  firstname: string;
  lastname: string;
  email: string;
  isDifferentShipping: boolean;
  [key: string]: any; // For any additional fields
}

const Page: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackString, setSnackString] = useState<boolean>(false);
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "info" | "warning">("success");
  const [updatedRow, setUpdatedRow] = useState<FormData | null>(null);
  const [deleteid, setDeleteid] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from("form").select("*");
        if (error) {
          throw error;
        }
 
        setRows(data || []);
      } catch (err: any) {
        console.error("Supabase Error:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setDeleteid(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase.from("form").delete().eq("id", deleteid);
      if (error) {
        throw error;
      }
      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteid));
      setOpen(false);
      setSnackOpen(true);
      setSnackString(false);
      setSnackSeverity("success");
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete record");
      setSnackOpen(true);
      setSnackString(false);
      setSnackSeverity("error");
    }
  };

  const handleSaveRow = async (updatedRow: FormData) => {
    try {
      const { error } = await supabase
        .from("form")
        .update(updatedRow)
        .eq("id", updatedRow.id);

      if (error) {
        throw error;
      }
      
      setSnackString(true);
      setSnackOpen(true);
      setSnackSeverity("success");
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setOpenEditModal(false);
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update record");
      setSnackOpen(true);
      setSnackString(false);
      setSnackSeverity("error");
    }
  };

  const handleEditOpen = (row: FormData) => {
    setUpdatedRow(row);
    setOpenEditModal(true);
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const columns = getColumns(handleEditOpen, handleDelete);
  
  return (
    <>
  


      {loading ? (
        <Box
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
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading data...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Alert severity="error" sx={{ maxWidth: "600px" }}>
            {error}
          </Alert>
        </Box>
      ) : (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DataGridComponent rows={rows} columns={columns} showButton={true} />
        </motion.div>
      )}

      {updatedRow && (
        <EditModalComponent
          openEditModal={openEditModal}
          handleEditClose={handleEditClose}
          updatedRow={updatedRow}
          handleSaveRow={handleSaveRow}
        />
      )}
      
      <DeleteModalComponent
        open={open}
        setOpen={setOpen}
        confirmDelete={confirmDelete}
      />
      
      <SuccessSnackbar
        handleClose={handleClose}
        openSnackbar={snackOpen}
        alertMessage={
          snackString
            ? "Record has been successfully updated!"
            : error 
              ? error 
              : "Record deleted successfully."
        }
        severity={snackSeverity}
        autoHideDuration={4000}
      />
       
    </>
  );
};

export default Page;