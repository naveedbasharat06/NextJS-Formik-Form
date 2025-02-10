"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ResponsiveAppBar() {
  const pathname = usePathname();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            color="outline"
            component="div"
            sx={{ marginLeft: 10, cursor: "pointer" }}
            // className={
            //   pathname === "/"
            //     ? "bg-blue-800 mr-4 p-2 "
            //     : " mr-4 p-2 hover:bg-blue-300"
            // }
          >
            <Link href="/">Manage</Link>
          </Typography>

          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ marginLeft: 3, cursor: "pointer" }}
            // className={
            //   pathname === "/addContactDetals"
            //     ? "bg-blue-800 mr-4 p-2"
            //     : " mr-4 p-2 hover:bg-blue-300"
            // }
          >
            <Link href="/addContactDetals">Add Contact</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
