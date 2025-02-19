"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import supabase from "../../utils/supabaseClient";
import { Button, IconButton, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "./ThemeRegistry"; // Import the theme context hook

export default function ResponsiveAppBar() {
  const theme = useTheme();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { mode, toggleTheme } = useThemeContext(); // Access theme context

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

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
            {[
              { label: "Contact Details", path: "/" },
              { label: "Locate Yourself", path: "/locateYourself" },
            ].map((item) => (
              <Typography
                key={item.path}
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
            ))}
          </Box>

          {/* Auth Links or User Info */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {user ? (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    color: "inherit",
                    opacity: 1,
                    padding: "6px 0",
                  }}
                >
                  Welcome, {user.user_metadata?.display_name || user.email}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: "inherit", borderColor: "inherit" }}
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              [
                { label: "Sign Up", path: "/signup" },
                { label: "Login", path: "/login" },
              ].map((item) => (
                <Typography
                  key={item.path}
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
              ))
            )}

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
