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
import supabase from "../../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import SuccessSnackbar from "../../components/SuccessSnackbar";

const SignupPage: React.FC = () => {
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
  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        //   validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setErrorMessage(null); // Reset error message
          try {
            const { data, error } = await supabase.auth.signUp({
              email: values.email,
              password: values.password,
              options: {
                data: { display_name: values.name },
                emailRedirectTo:
                  "https://next-js-formik-form-git-master-naveedbasharat06s-projects.vercel.app/VerificationSuccess", // Store 'name' in user metadata
              },
            });

            if (error) {
              throw error; // Throw error if sign-up fails
            }

            if (data.user) {
              setTimeout(() => {
                router.push("/login");
              }, 3000);
              setSnackOpen(true);
              setSnackString(
                "Signup successful! Check your email for verification."
              );
              // alert("Signup successful! Check your email for verification.");
            } else {
              throw new Error("Signup failed. Please try again.");
            }
          } catch (error: any) {
            setErrorMessage(error.message); // Set error message if an error occurs
          } finally {
            setSubmitting(false); // Ensure form is no longer in submitting state
          }
        }}
      >
        {({ isSubmitting, handleChange, values }) => (
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
                        value={values.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ marginTop: 1.5 }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        type="email"
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Password"
                        fullWidth
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
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
                        sx={{ background: theme.palette.secondary.main }}
                      >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                      </Button>
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

export default SignupPage;
