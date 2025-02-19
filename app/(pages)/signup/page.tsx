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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import supabase from "../../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import SuccessSnackbar from "../../components/SuccessSnackbar";

// const validationSchema = Yup.object({
//   email: Yup.string().email("Invalid email address").required("Required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Required"),
//   name: Yup.string().name("invalid Name").required("Requires"),
// });

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackString, setSnackString] = useState<string>("");
  const router = useRouter();

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
                emailRedirectTo: "http://localhost:3000/login", // Store 'name' in user metadata
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
              <Box
                sx={{
                  width: 400,
                  padding: 2,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
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
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
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
