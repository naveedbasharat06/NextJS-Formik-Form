"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../utils/supabaseClient";
import { CircularProgress, Box, Typography } from "@mui/material";

const ProtectRoutes = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAdmin(true);
        }

        if (adminOnly && profile?.role !== "admin") {
          router.replace("/login"); // Redirect non-admins to home page
        }
      } else {
        router.replace("/login");
      }

      setLoading(false);
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace("/login");
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

  if (adminOnly && !isAdmin) return null;

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectRoutes;

