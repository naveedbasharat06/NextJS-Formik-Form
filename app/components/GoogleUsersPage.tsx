"use client";
import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import DataGridComponent from "./DataGridComponent";
import { getColumns5 } from "../constants/datagridColumnsName";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import ProtectedRoute from "./ProtectRoutes";
import GoogleOAuthButton from "./GoogleOAuthButton";

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
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setSessionEmail(session.user.email);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchGoogleUsers = async () => {
      try {
        if (!sessionEmail) return;

        const { data, error } = await supabase
          .from("google_users")
          .select("*")
          .eq("email", sessionEmail)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setUsers(data);
          setNoMatchFound(false);
        } else {
          setNoMatchFound(true);
          setUsers([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (sessionEmail) {
      fetchGoogleUsers();
    }
  }, [sessionEmail]);

  const columns = getColumns5;

  return (
    <>
      <ProtectedRoute>
        <Typography
          sx={{
            marginTop: 4,
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: (theme) => theme.palette.primary.main,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
            transition: "color 0.3s, transform 0.3s",
            "&:hover": {
              color: (theme) => theme.palette.secondary.main,
              transform: "scale(1.05)",
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
            marginTop: 2,
            width: "100%",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : noMatchFound ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  p: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="h5" color="text.primary">
                  No matching Google account found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please authenticate using Google to access this page
                </Typography>
                <GoogleOAuthButton />
              </Box>
            </motion.div>
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
