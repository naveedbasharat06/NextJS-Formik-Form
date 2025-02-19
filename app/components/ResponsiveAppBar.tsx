"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import supabase from "../../utils/supabaseClient"; // Adjust the import path as needed
import { Button } from "@mui/material";

export default function ResponsiveAppBar() {
  const pathname = usePathname(); // Get the current route
  const [user, setUser] = useState<any>(null); // State to store the user's session

  // Fetch the user's session on component mount
  useEffect(() => {
    // Fetch the user's session on component mount
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };

    fetchUser();

    // Listen for auth state changes (e.g., sign-in, sign-out)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user); // Update user state on sign-in
        } else if (event === "SIGNED_OUT") {
          setUser(null); // Clear user state on sign-out
        }
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#003049",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {[
              { label: "Manage", path: "/" },
              { label: "Locate Yourself", path: "/locateYourself" },
            ].map((item) => (
              <Typography
                key={item.path}
                variant="h6"
                component="div"
                sx={{
                  cursor: "pointer",
                  color: "#E0E0E0",
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
            ))}
          </Box>

          {/* Auth Links or User Info */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {user ? (
              <>
                {/* // Display the display name if the user is logged in */}
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "#E0E0E0",
                    opacity: 1,
                    padding: "6px 0",
                  }}
                >
                  Welcome, {user.user_metadata?.display_name || user.email}{" "}
                  {/* Fallback to email if display name is not set */}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: "#E0E0E0", borderColor: "#E0E0E0" }}
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null); // Clear the user state
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              // Display Sign Up and Login links if the user is not logged in
              [
                { label: "Sign Up", path: "/signup" },
                { label: "Login", path: "/login" },
              ].map((item) => (
                <Typography
                  key={item.path}
                  variant="h6"
                  component="div"
                  sx={{
                    cursor: "pointer",
                    color: "#E0E0E0",
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
              ))
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
