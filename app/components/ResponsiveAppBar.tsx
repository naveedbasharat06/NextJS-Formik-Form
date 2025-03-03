"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../../utils/supabaseClient";
import { Button, IconButton, useTheme, CircularProgress } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "./ThemeRegistry";
import { motion, AnimatePresence } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ResponsiveAppBar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const { mode, toggleTheme } = useThemeContext();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("display_name, role") // Fetch role along with display_name
          .eq("id", sessionData.session.user.id)
          .single();
  
        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setSession({
            ...sessionData.session,
            user: {
              ...sessionData.session.user,
              display_name: profile?.display_name || sessionData.session.user.email,
              role: profile?.role, // Add role to session object
            },
          });
        }
      }
      setLoading(false);
    };
  
    fetchSession();
  
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchSession();
      } else {
        setSession(null);
      }
    });
  
    return () => listener.subscription.unsubscribe();
  }, [router]);
  

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.replace("/"); // Redirect to sign-in after logout
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: theme.palette.secondary.main,
          }}
        >
          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 4 }}>
            <Typography
              variant="h6"
              sx={{
                cursor: "pointer",
                color: "inherit",
                opacity: pathname === "/" ? 1 : 0.9,
                transition: "opacity 0.3s, border-bottom 0.3s",
                "&:hover": { opacity: 1 },
                borderBottom:
                  pathname === "/"
                    ? "2px solid #ffffff80"
                    : "2px solid transparent",
                padding: "6px 0",
              }}
            >
              <Link
                href="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Contact Details
              </Link>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                cursor: "pointer",
                color: "inherit",
                opacity: pathname === "/locateYourself" ? 1 : 0.9,
                transition: "opacity 0.3s, border-bottom 0.3s",
                "&:hover": { opacity: 1 },
                borderBottom:
                  pathname === "/locateYourself"
                    ? "2px solid #ffffff80"
                    : "2px solid transparent",
                padding: "6px 0",
              }}
            >
              <Link
                href="/locateYourself"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Locate Yourself
              </Link>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                cursor: "pointer",
                color: "inherit",
                opacity: pathname === "/products" ? 1 : 0.9,
                transition: "opacity 0.3s, border-bottom 0.3s",
                "&:hover": { opacity: 1 },
                borderBottom:
                  pathname === "/products"
                    ? "2px solid #ffffff80"
                    : "2px solid transparent",
                padding: "6px 0",
              }}
            >
              <Link
                href="/products"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Products
              </Link>
            </Typography>

            {/* New "Users" Nav Item (Visible Only for Logged-In Users) */}
            <AnimatePresence>
              {session && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      cursor: "pointer",
                      color: "inherit",
                      opacity: pathname === "/users" ? 1 : 0.9,
                      transition: "opacity 0.3s, border-bottom 0.3s",
                      "&:hover": { opacity: 1 },
                      borderBottom:
                        pathname === "/users"
                          ? "2px solid #ffffff80"
                          : "2px solid transparent",
                      padding: "6px 0",
                    }}
                  >
                    <Link
                      href="/users"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Users
                    </Link>
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
  {session && session.user.role === "admin" && (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Typography
        variant="h6"
        sx={{
          cursor: "pointer",
          color: "inherit",
          opacity: pathname === "/userRoles" ? 1 : 0.9,
          transition: "opacity 0.3s, border-bottom 0.3s",
          "&:hover": { opacity: 1 },
          borderBottom:
            pathname === "/userRoles"
              ? "2px solid #ffffff80"
              : "2px solid transparent",
          padding: "6px 0",
        }}
      >
        <Link href="/userRoles" style={{ textDecoration: "none", color: "inherit" }}>
          User Roles
        </Link>
      </Typography>
    </motion.div>
  )}
</AnimatePresence>
          </Box>

          {/* Auth Links or User Info */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <AnimatePresence>
              {session ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "inherit", opacity: 1, padding: "6px 0" }}
                    >
                      Welcome, {session.user.display_name || session.user.email}
                    </Typography>
                  </motion.div>
                  <Link href="/userProfile">
                    <AccountCircleIcon sx={{ cursor: "pointer" }} />
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        color: "inherit",
                        borderColor: "inherit",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? (
                        <CircularProgress size={20} sx={{ color: "inherit" }} />
                      ) : (
                        "Logout"
                      )}
                    </Button>
                  </motion.div>
                </>
              ) : (
                [
                  { label: "Sign Up", path: "/signup" },
                  { label: "Login", path: "/login" },
                ].map((item) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        cursor: "pointer",
                        color: "inherit",
                        opacity: pathname === item.path ? 1 : 0.9,
                        transition: "opacity 0.3s, border-bottom 0.3s",
                        "&:hover": { opacity: 1 },
                        borderBottom:
                          pathname === item.path
                            ? "2px solid #ffffff80"
                            : "2px solid transparent",
                        padding: "6px 0",
                      }}
                    >
                      <Link
                        href={item.path}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {item.label}
                      </Link>
                    </Typography>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Theme Toggle Button */}
            <IconButton sx={{ color: "inherit" }} onClick={toggleTheme}>
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}