"use client";
import React, { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import supabase from "../utils/supabaseClient";
import DataGridComponent from "./components/DataGridComponent";
import EditModalComponent from "./components/EditModalComponent";
import DeleteModalComponent from "./components/DeleteModalComponent";
import { getColumns } from "./constants/datagridColumnsName";
import SuccessSnackbar from "./components/SuccessSnackbar";
import { Box, CircularProgress } from "@mui/material";

const Page: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackString, setSnackString] = useState(false);
  const [updatedRow, setUpdatedRow] = useState<any>({});
  const [deleteid, setDeleteid] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // console.log("Fetching data..."); // Debugging statement

      const { data, error } = await supabase.from("form").select("*");
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        // console.log("Fetched Data:", data); // Check if data is returned
        setRows(data);
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
    const { error } = await supabase.from("form").delete().eq("id", deleteid);
    if (error) {
      console.error(error);
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteid));
      setOpen(false);
      setSnackOpen(true);
      setSnackString(false);
    }
  };

  const handleSaveRow = async (updatedRow: any) => {
    const { error } = await supabase
      .from("form")
      .update(updatedRow)
      .eq("id", updatedRow.id);

    if (error) {
      console.error(error);
    } else {
      setSnackString(true);
      setSnackOpen(true);
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setOpenEditModal(false);
    }
  };

  const handleEditOpen = (row: any) => {
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
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100vw",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGridComponent rows={rows} columns={columns} showButton={true} />
      )}

      <EditModalComponent
        openEditModal={openEditModal}
        handleEditClose={handleEditClose}
        updatedRow={updatedRow}
        handleSaveRow={handleSaveRow}
      />
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
            : "Record deleted successfully."
        }
      />
    </>
  );
};

export default Page;
