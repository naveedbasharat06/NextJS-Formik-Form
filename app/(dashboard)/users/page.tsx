"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectRoutes";
import supabase from "../../../utils/supabaseClient"; // Adjust the path as needed
import DataGridComponent from "../../components/DataGridComponent";
import { GridRowsProp } from "@mui/x-data-grid";
import { getColumns3 } from "../../constants/datagridColumnsName";
import { Box, CircularProgress, Button } from "@mui/material";
import UserEditModalComponent from "../../components/UserEditModalComponent";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { motion } from "framer-motion";

const Page = () => {
  const [rows, setRows] = useState<GridRowsProp>([]); // State to store rows for DataGrid
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [user, setUser] = useState<any>(null); // State to store current user
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updatedRow, setUpdatedRow] = useState<any>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackString, setSnackString] = useState("");
  // const [role,setRole]=useState("")


  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setUser(session.session.user);
      }
    };

    const fetchProfiles = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) {
          throw new Error("User not logged in");
        }
    
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, role, display_name") // Add display_name here
          .eq("id", session.session.user.id)
          .single();
    
        if (profileError) {
          throw profileError;
        }
    
        // If the user is an admin, fetch all profiles
        if (profile.role === "admin") {
          const { data: allProfiles, error: allProfilesError } = await supabase
            .from("profiles")
            .select("id, email, role, display_name"); // Add display_name here
    
          if (allProfilesError) {
            throw allProfilesError;
          }
    
          setRows(
            allProfiles.map((p) => ({
              id: p.id,
              email: p.email,
              role: p.role || "visitor", // Default to 'visitor' if role is null
              display_name: p.display_name || "", // Add display_name here
            }))
          );
        } else {
          // If the user is not an admin, fetch only their profile
          setRows([
            {
              id: profile.id,
              email: profile.email,
              role: profile.role || "visitor",
              display_name: profile.display_name || "", // Add display_name here
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProfiles();
  }, []);

  const handleEditOpen = (row: any) => {
    
      setUpdatedRow(row);
      setOpenEditModal(true);
    
    
  

    
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
  };

  const handleSaveRow = async (updatedRow: any) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error("User not logged in");
      return;
    }
  
    // Fetch the current user's profile to check their role
    const { data: currentUserProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.session.user.id)
      .single();
  
    if (profileError) {
      console.error("Error fetching current user's profile:", profileError);
      return;
    }
  
    // If the user is not an admin, ensure they can only update their own profile
    if (currentUserProfile.role !== "admin" && updatedRow.id !== session.session.user.id) {
      console.error("Unauthorized: You can only update your own profile");
      return;
    }
  
    const { error } = await supabase
      .from("profiles")
      .update({
        email: updatedRow.email,
        role: updatedRow.role,
        display_name:updatedRow.display_name
         // Add display_name here
      })
      .eq("id", updatedRow.id);
  
    if (error) {
      console.error(error);
    } else {
      setSnackString("Data is successfully updated");
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
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DataGridComponent
                rows={rows}
                columns={columns}
                showUserButton={true}
              />
            </motion.div>
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
        }
      />
    </ProtectedRoute>
  );
};

export default Page;