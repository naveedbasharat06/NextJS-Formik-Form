"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectRoutes";
import supabase from "../../../utils/supabaseClient"; // Adjust the path as needed
import DataGridComponent from "../../components/DataGridComponent";
import { GridRowsProp } from "@mui/x-data-grid";
import { getColumns3 } from "../../constants/datagridColumnsName";
import { Box, CircularProgress } from "@mui/material";
import UserEditModalComponent from "../../components/UserEditModalComponent";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";

const Page = () => {
  const [rows, setRows] = useState<GridRowsProp>([]); // State to store rows for DataGrid
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [user, setUser] = useState<any>(null); // State to store current user
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updatedRow, setUpdatedRow] = useState<any>({});
    const [snackOpen, setSnackOpen] = useState(false);
     const [snackString, setSnackString] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setUser(session.session.user);
      }
    };

    const fetchProfiles = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("id, email, role");

        if (error) {
          throw error;
        }

        setRows(
          profiles.map((profile) => ({
            id: profile.id,
            email: profile.email,
            role: profile.role || "visitor", // Default to 'visitor' if role is null
          }))
        );
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProfiles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", id);

      if (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role!");
        return;
      }

      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, role } : row))
      );

      alert("Role updated successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  const handleEditOpen = (row: any) => {
    setUpdatedRow(row);
    setOpenEditModal(true);
    console.log(row);
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
  };
  const handleSaveRow = async (updatedRow: any) => {
    const { error } = await supabase
      .from("profiles")
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
    const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason
    ) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackOpen(false);
    };
  // Pass the user object to getColumns3
  const columns = getColumns3(handleEditOpen, user);

  return (
    <ProtectedRoute>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100vh", // Full viewport height
            width: "98vw",
          }}
        >
          <Box
            sx={{
              margin: 4,
              width: "98%",
            }}
          >
            <DataGridComponent
              rows={rows}
              columns={columns}
              showUserButton={true}
            />
          </Box>
        </Box>
      )}
      <UserEditModalComponent
        openEditModal={openEditModal}
        handleEditClose={handleEditClose}
        updatedRow={updatedRow}
        handleSaveRow={handleSaveRow}
      />
       <SuccessSnackbar
        handleClose={handleClose}
        openSnackbar={snackOpen}
        alertMessage={
          snackString
            ? "Record has been successfully updated!"
            : "Record deleted successfully."
        } />
    </ProtectedRoute>
  );
};

export default Page;
