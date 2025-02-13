"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ResponsiveAppBar() {
  const pathname = usePathname(); // Get the current route

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1E1E1E", // Dark gray for smooth contrast with black background
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)", // Soft glow effect
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "center", // Center navigation links
          }}
        >
          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {[
              { label: "Manage", path: "/" },
              { label: "Add Contact", path: "/addContactDetails" },
              { label: "Locate Yourself", path: "/locateYourself" },
            ].map((item) => (
              <Typography
                key={item.path}
                variant="h6"
                component="div"
                sx={{
                  cursor: "pointer",
                  color: "#E0E0E0", // Light gray text for readability
                  opacity: pathname === item.path ? 1 : 0.9,
                  transition: "opacity 0.3s, border-bottom 0.3s",
                  "&:hover": { opacity: 1 },
                  borderBottom:
                    pathname === item.path
                      ? "2px solid #ffffff80" // White with 50% opacity for subtle highlight
                      : "2px solid transparent",
                  padding: "6px 0",
                }}
              >
                <Link href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                  {item.label}
                </Link>
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
