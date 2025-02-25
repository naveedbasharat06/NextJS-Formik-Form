"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../utils/supabaseClient";
import { CircularProgress, Box, Typography } from "@mui/material";

const ProtectRoutes = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsAuthenticated(true);
      } else {
        router.replace("/login"); // Redirect to sign-in page if not logged in
      }

      setLoading(false);
    };

    checkAuth();

    // Listen for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace("/login"); // Redirect when logged out
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Checking authentication...</Typography>
      </Box>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectRoutes;
