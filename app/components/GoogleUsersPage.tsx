"use client";
import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import DataGridComponent from "./DataGridComponent";
import { getColumns5 } from "../constants/datagridColumnsName";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ProtectedRoute from "./ProtectRoutes";

interface GoogleUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
}

const GoogleUsersPage = () => {
  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoogleUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("google_users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleUsers();
  }, []);

  const columns = getColumns5;

  return (
    <>
      <ProtectedRoute>
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
          GOOGLE OAUTH USERS
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2, // Full viewport height
            width: "100%",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Full viewport height
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DataGridComponent
                rows={users}
                columns={columns}
                showUserButton={true}
                width={"80vw"}
              />
            </motion.div>
          )}
        </Box>
      </ProtectedRoute>
    </>
  );
};

export default GoogleUsersPage;
