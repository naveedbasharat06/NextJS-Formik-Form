"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import supabase from "../../../utils/supabaseClient";

const VerifyPage: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get email from query params
  const phone = searchParams.get("phone"); // Get phone from query params

  // Log the phone number coming from signup
  useEffect(() => {
    console.log("Phone number from signup:", phone);
    console.log("Type of phone number:", typeof phone); // Should be "string"
  }, [phone]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!otp) {
        throw new Error("Please enter the OTP.");
      }

      // Ensure phone number is in E.164 format
      const formattedPhone = phone ? `+${phone.replace(/\D/g, "")}` : null;

      if (!formattedPhone) {
        throw new Error("Invalid phone number format.");
      }

      // Log the formatted phone number
      console.log("Formatted phone number:", formattedPhone);
      console.log("Type of formatted phone number:", typeof formattedPhone); // Should be "string"

      // Verify OTP using Supabase
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone, // Ensure this is a string in E.164 format
        token: otp,
        type: "sms", // Use "sms" for phone verification
      });

      if (error) {
        throw error;
      }

      // Redirect to success page or login page
      router.push("/login");
    } catch (error: any) {
      setErrorMessage(
        error.message || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Verify Your Account
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter the OTP sent to {email || phone}.
        </Typography>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Box component="form" onSubmit={handleVerify} sx={{ width: "100%" }}>
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default VerifyPage;