"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

export default function ResponsiveAppBar() {
  const pathname = usePathname(); // Get the current route

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          variant="dense"
          sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
        >
          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "medium",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
                borderBottom:
                  pathname === "/"
                    ? "2px solid white"
                    : "2px solid transparent", // Active link style
                padding: "4px 0", // Add padding for better spacing
              }}
            >
              <Link
                href="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Manage
              </Link>
            </Typography>

            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "medium",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
                borderBottom:
                  pathname === "/addContactDetals"
                    ? "2px solid white"
                    : "2px solid transparent", // Active link style
                padding: "4px 0", // Add padding for better spacing
              }}
            >
              <Link
                href="/addContactDetals"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Add Contact
              </Link>
            </Typography>

            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "medium",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
                borderBottom:
                  pathname === "/locateYourself"
                    ? "2px solid white"
                    : "2px solid transparent", // Active link style
                padding: "4px 0", // Add padding for better spacing
              }}
            >
              <Link
                href="/locateYourself"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Locate Yourself
              </Link>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
