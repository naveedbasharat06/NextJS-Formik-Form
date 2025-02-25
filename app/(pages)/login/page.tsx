"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import supabase from "../../../utils/supabaseClient";
import { useRouter } from "next/navigation";

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Password is required"),
});

const SignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setErrorMessage(null);
        setIsAuthenticating(true); // Start authentication process

        try {
          // Validate form inputs
          if (!values.email || !values.password) {
            setErrorMessage("Please fill in all fields.");
            return;
          }

          // Sign in with email and password
          const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });

          if (error) throw error;

          // Redirect on successful sign-in
          if (data.user) {
            // Persist session in local storage
            localStorage.setItem("sb-access-token", data.session.access_token);
            localStorage.setItem(
              "sb-refresh-token",
              data.session.refresh_token
            );

            router.push("/"); // Redirect to home page
          } else {
            throw new Error("Sign-in failed. Please try again.");
          }
        } catch (error: any) {
          // Handle specific errors
          if (error.message === "Invalid login credentials") {
            setErrorMessage("Incorrect email or password. Please try again.");
          } else {
            setErrorMessage(
              "An unexpected error occurred. Please try again later."
            );
          }
          setIsAuthenticating(false); // Stop loading if an error occurs
        } finally {
          setSubmitting(false); // Reset form submission state
        }
      }}
    >
      {({ isSubmitting, handleChange, values, errors, touched }) =>
        isAuthenticating ? (
          // Loading Screen
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Authenticating...
            </Typography>
          </Box>
        ) : (
          <Form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Box
                sx={{
                  width: 400,
                  padding: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: "0px 10px 30px rgba(0,0,255,0.4)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                  Sign In
                </Typography>

                {errorMessage && (
                  <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Typography>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      type="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      fullWidth
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
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
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{ background: theme.palette.secondary.main }}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Form>
        )
      }
    </Formik>
  );
};

export default SignInPage;
