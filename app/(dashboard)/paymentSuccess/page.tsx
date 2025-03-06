"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon
import { useRouter } from "next/navigation"; // For navigation in Next.js

const PaymentSuccessPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

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
        Payment Successful!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Thank you for your purchase. Your payment has been successfully
        processed.
      </Typography>

      {/* Continue Button */}
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: theme.palette.primary.main,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }}
        onClick={() => router.push("/")} // Redirect to home or dashboard
      >
        Continue Shopping
      </Button>
    </Box>
  );
};

export default PaymentSuccessPage;
