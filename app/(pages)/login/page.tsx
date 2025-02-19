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
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import supabase from "../../../utils/supabaseClient";
import { useRouter } from "next/navigation";

// Validation Schema
// const validationSchema = Yup.object({
//   email: Yup.string().email("Invalid email address").required("Required"),
//   password: Yup.string().required("Password is required"),
// });

const SignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  console.log(theme);
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      //   validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setErrorMessage(null); // Reset error message
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });

          if (error) {
            throw error; // Throw error if sign-in fails
          }

          if (data.user) {
            router.push("/"); // Redirect to dashboard after successful sign-in
          } else {
            throw new Error("Sign-in failed. Please try again.");
          }
        } catch (error: any) {
          setErrorMessage(error.message); // Set error message if an error occurs
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
                Sign In
              </Typography>

              {errorMessage && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              <Grid container spacing={2}>
                <Grid size={12}>
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
                <Grid size={12}>
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignInPage;
