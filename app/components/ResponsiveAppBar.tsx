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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      console.log(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setSession(session);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setSession(null);
    router.push("/login");
    setTimeout(() => {
      setLoggingOut(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

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

            {/* New "Users" Nav Item (Visible Only for Logged-In Users) */}
            {/* Protected Routes (Only for Logged-In Users) */}
            {session && (
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
            )}
          </Box>

          {/* Auth Links or User Info */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {session ? (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: "inherit", opacity: 1, padding: "6px 0" }}
                >
                  Welcome,{" "}
                  {session.user.user_metadata?.display_name ||
                    session.user.email}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: "inherit", borderColor: "inherit" }}
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out..." : "Logout"}
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
