"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon
// import { useRouter } from "next/navigation"; // For navigation in Next.js
// For navigation

const VerificationSuccessPage: React.FC = () => {
  const theme = useTheme();
  //   const navigate = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        textAlign: "center",
        padding: theme.spacing(4),
      }}
    >
      {/* Animated Check Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 100,
            color: theme.palette.success.main,
            mb: 2,
          }}
        />
      </motion.div>

      {/* Success Message */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Verification Successful!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Your account has been successfully verified. You can now access all
        features of the platform.
      </Typography>

      {/* Continue Button */}
      {/* <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: theme.palette.primary.main,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }}
        onClick={() => navigate.push("/")} // Redirect to home or dashboard
      >
        Continue to Dashboard
      </Button> */}
    </Box>
  );
};

export default VerificationSuccessPage;
