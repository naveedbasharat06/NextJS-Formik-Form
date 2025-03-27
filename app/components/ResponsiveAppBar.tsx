"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import {
  Button,
  IconButton,
  useTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "./ThemeRegistry";
import { motion, AnimatePresence } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartWithBadge from "./ShoppingCartWithBadge";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Import icons for menu items
import GoogleIcon from "@mui/icons-material/Google";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TableChartIcon from "@mui/icons-material/TableChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import MailIcon from "@mui/icons-material/Mail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

interface ResponsiveAppBarProps {
  children?: React.ReactNode;
}

export default function ResponsiveAppBar({ children }: ResponsiveAppBarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const { mode, toggleTheme } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState<boolean>(true);

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
              display_name:
                profile?.display_name || sessionData.session.user.email,
              role: profile?.role,
              photo_url: profile?.photo_url,
            },
          });
        }
      }
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          fetchSession();
        } else {
          setSession(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.replace("/");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle the menu state
  };

  // Define menu items with icons
  const menuItems = [
    { label: "Contact Details", path: "/", icon: <ContactMailIcon /> },
    {
      label: "Locate Yourself",
      path: "/locateYourself",
      icon: <LocationOnIcon />,
    },
    { label: "Shop", path: "/shop", icon: <ShoppingCartIcon /> },
    { label: "Data Table", path: "/dataTable", icon: <TableChartIcon /> },
    { label: "Events", path: "/events", icon: <EventIcon /> },
    { label: "Inbox", path: "/inbox", icon: <MailIcon /> },
    ...(session
      ? [{ label: "OAuth Users", path: "/OAuthUsers", icon: <GoogleIcon /> }]
      : []),
    ...(session
      ? [{ label: "Products", path: "/products", icon: <InventoryIcon /> }]
      : []),
    ...(session
      ? [{ label: "Users", path: "/users", icon: <PeopleIcon /> }]
      : []),
    ...(session && session.user.role === "admin"
      ? [
          {
            label: "User Roles",
            path: "/userRoles",
            icon: <AdminPanelSettingsIcon />,
          },
        ]
      : []),
  ];

  // Animation variants for the drawer
  const drawerVariants = {
    open: {
      width: 240,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 1,
        velocity: 2,
      },
    },
    closed: {
      width: 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 1,
        velocity: 2,
      },
    },
  };

  // Animation variants for the menu items
  const menuItemVariants = {
    open: {
      opacity: 1,
      visibility: "visible" as const, // Use valid value for visibility
      transition: { delay: 0.1 },
    },
    closed: {
      opacity: 0,
      visibility: "hidden" as const, // Use valid value for visibility
      transition: { duration: 0.1 },
    },
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Left Vertical Menu Bar with Animation */}
      <motion.div
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={drawerVariants}
        style={{
          flexShrink: 0,
          backgroundColor: theme.palette.primary.main,
          borderRight: `1px solid ${theme.palette.divider}`,
          height: "100vh",
          position: "fixed",
          overflowX: "hidden",
          zIndex: 1,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={toggleMenu}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Menu Items */}
        <motion.div
          initial={false}
          animate={menuOpen ? "open" : "closed"}
          variants={menuItemVariants}
        >
          <List sx={{ mt: 8 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                component="div"
                sx={{
                  backgroundColor:
                    pathname === item.path
                      ? "rgba(0, 0, 0, 0.3)"
                      : "transparent",
                  color: pathname === item.path ? "white" : "inherit",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                  borderLeft:
                    pathname === item.path
                      ? "4px solid #ffffff"
                      : "4px solid transparent",
                  boxShadow:
                    pathname === item.path
                      ? "0px 4px 8px rgba(0,0,0,0.2)"
                      : "none",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                  },
                  transition: "all 0.3s",
                }}
              >
                <Link href={item.path} passHref>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: menuOpen ? "240px" : 0,
          transition: "margin 0.3s",
        }}
      >
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar
            variant="dense"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: theme.palette.secondary.main,
            }}
          >
            {/* Menu Icon to toggle the left menu */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMenu}
            >
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
                      <Typography
                        variant="h6"
                        sx={{ color: "inherit", opacity: 1, padding: "6px 0" }}
                      >
                        Welcome,{" "}
                        {session.user.display_name || session.user.email}
                      </Typography>
                    </motion.div>

                    {/* Profile Image or Icon */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
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
                        <AccountCircleIcon
                          sx={{ fontSize: 40, color: "inherit" }}
                        />
                      )}
                    </motion.div>

                    {/* Logout Button */}
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
                          <CircularProgress
                            size={20}
                            sx={{ color: "inherit" }}
                          />
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
        {children}
      </Box>
    </Box>
  );
}
