"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectRoutes";
import supabase from "../../../utils/supabaseClient"; // Adjust the path as needed
import DataGridComponent from "../../components/DataGridComponent";
import { GridRowsProp } from "@mui/x-data-grid";
import { getColumns3 } from "../../constants/datagridColumnsName";
import { Box, CircularProgress } from "@mui/material";
import supabaseAdmin from "../../../utils/supabaseClient2";

const Page = () => {
  const [rows, setRows] = useState<GridRowsProp>([]); // State to store rows for DataGrid
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [user, setUser] = useState<any>(null); // State to store current user

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setUser(session.session.user);
      }
    };

    const fetchProfiles = async () => {
      try {
        // Fetch all profiles from the public.profiles table
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("id, email, role");
    
        if (error) {
          throw error;
        }
    
        // Fetch active sessions for each user
        const profilesWithStatus = await Promise.all(
          profiles.map(async (profile) => {
            // Check if the user has an active session
            const { data: session, error: sessionError } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    
            if (sessionError) {
              console.error("Error fetching session for user:", profile.id, sessionError);
              return {
                ...profile,
                isConnected: false,
              };
            }
    
            const lastSignIn = session.user?.last_sign_in_at;
            const isConnected = lastSignIn && new Date(lastSignIn) > new Date(Date.now() - 5 * 60 * 1000); // Last 5 minutes check
    
            return {
              ...profile,
              isConnected,
            };
          })
        );
    
        // Filter out only currently logged-in users
        const loggedInUsers = profilesWithStatus.filter((profile) => profile.isConnected);
    
        console.log("Currently Logged-in Users:", loggedInUsers); // ✅ Print logged-in users to console
    
        setRows(profilesWithStatus);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    

    const fetchActiveUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        console.log("Currently logged in user:", user);
      } else {
        console.log("No user is logged in");
      }
    };

    fetchActiveUsers();
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

  const columns = getColumns3(handleRoleChange);

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
        <Box sx={{ margin: 4 }}>
          <DataGridComponent rows={rows} columns={columns} showUserButton={true} />
        </Box>
      )}
    </ProtectedRoute>
  );
};

export default Page;