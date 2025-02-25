"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectRoutes";
import supabase from "../../../utils/supabaseClient"; // Adjust the path as needed
import DataGridComponent from "../../components/DataGridComponent";
import { GridRowsProp, GridValidRowModel } from "@mui/x-data-grid";
import { getColumns3 } from "../../constants/datagridColumnsName";
import { Box } from "@mui/material";

// Define the type for the profile data
interface Profile {
  id2: string;
  email: string;
}

const Page = () => {
  const [rows, setRows] = useState<GridRowsProp>([]); // State to store rows for DataGrid
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Fetch emails and IDs from the public.profiles table
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id2, email"); // Fetch both id and email

        if (error) {
          throw error;
        }

        // Log the data to the console
        console.log("Profiles:", data);

        // Update the state with the fetched data
        setRows(
          data.map((profile) => ({
            id: profile.id2, // Use the id as the unique identifier for DataGrid
            email: profile.email,
          }))
        );
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const columns = getColumns3();

  return (
    <ProtectedRoute>
      
<Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100vw",
          }}> 

      {/* Render the DataGridComponent */}
      <DataGridComponent rows={rows} columns={columns} showUserButton={true} />
</Box>
    </ProtectedRoute>
  );
};

export default Page;