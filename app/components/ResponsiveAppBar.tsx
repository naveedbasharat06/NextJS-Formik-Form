"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../../utils/supabaseClient";
import { Button, IconButton, useTheme, CircularProgress, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "./ThemeRegistry";
import { motion, AnimatePresence } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartWithBadge from "./ShoppingCartWithBadge";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";



interface ResponsiveAppBarProps {
  children?: React.ReactNode; // Add children as a prop
}

export default function ResponsiveAppBar({ children }: ResponsiveAppBarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const { mode, toggleTheme } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState<boolean>(true); // Controls the visibility of the left menu

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("display_name, role, photo_url")
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
              role: profile?.role,
              photo_url: profile?.photo_url,
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
    router.replace("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    { label: "Contact Details", path: "/" },
    { label: "Locate Yourself", path: "/locateYourself" },
    { label: "Shop", path: "/shop" },
    { label: "Contact Data", path: "/contactsData" },
    ...(session ? [{ label: "Products", path: "/products" }] : []),
    ...(session ? [{ label: "Users", path: "/users" }] : []),
    ...(session && session.user.role === "admin" ? [{ label: "User Roles", path: "/userRoles" }] : []),
  ];

  return (
<Box sx={{ display: "flex" }}>
  {/* Left Vertical Menu Bar */}
  <Box
    sx={{
      width: menuOpen ? 240 : 0, // Width of the menu when open/closed
      flexShrink: 0,
      transition: "width 0.3s", // Smooth transition
      backgroundColor: theme.palette.primary.main,
      borderRight: `1px solid ${theme.palette.divider}`,
      height: "100vh", // Full height
      position: "fixed", // Fixed position
      overflowX: "hidden", // Hide overflow when closed
      zIndex: 1, // Ensure it stays above the main content
    }}
  >
    {/* Close Button */}
    <IconButton
      onClick={toggleMenu}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
      
      }}
    >
      <ChevronLeftIcon />
    </IconButton>

    {/* Menu Items */}
    <List sx={{ mt: 8 }}>
      {menuItems.map((item) => (
        <ListItem
          key={item.path}
          component="div" // Use a div as the component
          onClick={toggleMenu}
          sx={{
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
     
          <Link href={item.path} passHref>

            <ListItemText sx={{ color: "white" }}
            
            primary={item.label}
            
            />
          </Link>
     
        </ListItem>
      ))}
    </List>
  </Box>

  {/* Main Content */}
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3,
      marginLeft: menuOpen ? "240px" : 0, // Adjust margin based on menu state
      transition: "margin 0.3s", // Smooth transition
    }}
  >
    {/* AppBar */}
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar
        variant="dense"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        {/* Menu Icon to toggle the left menu */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu}>
          <MenuIcon />
        </IconButton>

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
                  <Typography variant="h6" sx={{ color: "inherit", opacity: 1, padding: "6px 0" }}>
                    Welcome, {session.user.display_name || session.user.email}
                  </Typography>
                </motion.div>

                {/* Profile Image or Icon */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                  {session.user.photo_url ? (
                    <img
                      src={session.user.photo_url}
                      alt="Profile"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <AccountCircleIcon sx={{ fontSize: 40, color: "inherit" }} />
                  )}
                </motion.div>

                {/* Logout Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
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
                    {loggingOut ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : "Logout"}
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
                        pathname === item.path ? "2px solid #ffffff80" : "2px solid transparent",
                      padding: "6px 0",
                    }}
                  >
                    <Link href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                      {item.label}
                    </Link>
                  </Typography>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <ShoppingCartWithBadge />
            <IconButton sx={{ color: "inherit" }} onClick={toggleTheme}>
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>

    {/* Main Content Area */}
    <Box> {/* Add marginTop to account for the AppBar */}
      {/* Your main content goes here */}
      {children}
    </Box>
  </Box>
</Box>
  );
}