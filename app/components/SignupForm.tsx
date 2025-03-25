"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Typography,
  SnackbarCloseReason,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import supabase from "../utils/supabaseClient";
import { useRouter } from "next/navigation";
import SuccessSnackbar from "./SuccessSnackbar";
import GoogleOAuthButton from "./GoogleOAuthButton";

interface SignupFormProps {
  onSuccess?: () => void; // Callback for successful signup
  onError?: (error: string) => void; // Callback for errors
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackString, setSnackString] = useState<string>("");
  const router = useRouter();
  const theme = useTheme();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .test(
        "email-or-phone",
        "Please provide either an email or a phone number, but not both.",
        function (value) {
          const { phone } = this.parent; // Access sibling field (phone)
          if (value && phone) {
            return this.createError({
              message:
                "Please provide either an email or a phone number, but not both.",
            });
          }
          if (!value && !phone) {
            return this.createError({
              message: "Please provide either an email or a phone number.",
            });
          }
          return true;
        }
      ),
    phone: Yup.string().test(
      "phone-or-email",
      "Please provide either an email or a phone number, but not both.",
      function (value) {
        const { email } = this.parent; // Access sibling field (email)
        if (value && email) {
          return this.createError({
            message:
              "Please provide either an email or a phone number, but not both.",
          });
        }
        if (!value && !email) {
          return this.createError({
            message: "Please provide either an email or a phone number.",
          });
        }
        return true;
      }
    ),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", name: "", phone: "" }} // Ensure all fields are initialized
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setErrorMessage(null); // Reset error message
          try {
            if (!values.email && !values.phone) {
              throw new Error(
                "Please provide either an email or a phone number."
              );
            }

            let redirectToVerify = false;

            // Sign up with email and password if email is provided
            if (values.email) {
              const { data: emailData, error: emailError } =
                await supabase.auth.signUp({
                  email: values.email,
                  password: values.password,
                  options: {
                    data: { display_name: values.name },
                    emailRedirectTo:
                      "https://next-js-formik-form-git-master-naveedbasharat06s-projects.vercel.app/VerificationSuccess",
                  },
                });

              if (emailError) {
                throw emailError;
              }

              if (emailData.user) {
                setSnackOpen(true);
                setSnackString(
                  "Signup successful! Check your email for verification."
                );
                onSuccess?.(); // Trigger onSuccess callback
              } else {
                throw new Error("Signup failed. Please try again.");
              }
            }

            // Send OTP for phone verification if phone is provided
            if (values.phone) {
              const { error: phoneError } = await supabase.auth.signInWithOtp({
                phone: values.phone,
              });

              if (phoneError) {
                throw phoneError; // Throw error if OTP sending fails
              }

              // Only set redirectToVerify to true if OTP is successfully sent
              redirectToVerify = true;
              setSnackOpen(true);
              setSnackString(
                "Signup successful! Check your phone for verification."
              );
              onSuccess?.(); // Trigger onSuccess callback
            }

            // Redirect to verification page only if OTP was successfully sent
            if (redirectToVerify) {
              setTimeout(() => {
                router.push(`/verifyUser?phone=${values.phone}`);
              }, 3000);
            }
          } catch (error: any) {
            setErrorMessage(error.message); // Set error message if an error occurs
            setSnackOpen(true);
            setSnackString(error.message); // Show error message in snackbar
            onError?.(error.message); // Trigger onError callback
          } finally {
            setSubmitting(false); // Ensure form is no longer in submitting state
          }
        }}
      >
        {({ isSubmitting, handleChange, values, errors, touched }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height
              }}
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    width: 400,
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "0px 10px 30px rgba(0,0,255,0.4)", // Blue glow shadow
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)", // Slight hover effect
                    },
                  }}
                >
                  <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                    Sign Up
                  </Typography>

                  {errorMessage && (
                    <Typography color="error" align="center" sx={{ mb: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}

                  <Grid container spacing={2}>
                    <Grid size={20}>
                      <TextField
                        label="Name"
                        name="name"
                        value={values.name || ""} // Ensure value is never undefined
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ marginTop: 1.5 }}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Email"
                        name="email"
                        value={values.email || ""} // Ensure value is never undefined
                        onChange={handleChange}
                        fullWidth
                        error={touched.email && !!errors.email} // Show error state
                        helperText={touched.email && errors.email} // Display error message
                        type="email"
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Phone"
                        name="phone"
                        value={values.phone || ""} // Ensure value is never undefined
                        onChange={handleChange}
                        fullWidth
                        error={touched.phone && !!errors.phone} // Show error state
                        helperText={touched.phone && errors.phone} // Display error message
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Password"
                        fullWidth
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password || ""} // Ensure value is never undefined
                        onChange={handleChange}
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                          background: theme.palette.secondary.main,
                          marginBottom: 1,
                        }}
                      >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                      </Button>
                      <GoogleOAuthButton />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            </Box>
          </Form>
        )}
      </Formik>
      <SuccessSnackbar
        handleClose={handleClose}
        openSnackbar={snackOpen}
        alertMessage={snackString}
      />
    </>
  );
};

export default SignupForm;
