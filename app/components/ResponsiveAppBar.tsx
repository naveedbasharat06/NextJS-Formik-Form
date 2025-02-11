"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function ResponsiveAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            color="outline"
            component="div"
            sx={{ marginLeft: 10, cursor: "pointer" }}
          >
            <Link href="/">Manage</Link>
          </Typography>

          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ marginLeft: 3, cursor: "pointer" }}
          >
            <Link href="/addContactDetals">Add Contact</Link>
          </Typography>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ marginLeft: 3, cursor: "pointer" }}
          >
            <Link href="/locateYourself">Loacate Yourself</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
