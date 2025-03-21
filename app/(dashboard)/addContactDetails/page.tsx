"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import supabase from "../../utils/supabaseClient";
import { Formik, Form } from "formik";
import BillingAddressForm from "../../components/BillingAddressForm";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const FormComponent = () => {
  const theme = useTheme();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push("/"); // Redirect after success
      }, 1500);
    }
  }, [success, router]);

  const handleSubmit = async (values) => {
    console.log("Submitting form with values:", values);

    const { data, error } = await supabase.from("form").insert([values]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <Formik
      initialValues={{
        firstname: "",
        lastname: "",
        email: "",
        name: "",
        address: "",
        shippingName: "",
        shippingAddress: "",
        isDifferentShipping: false,
      }}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%", // Full viewport height
              width: "100%",
              marginTop: 7,
            }}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  maxWidth: 600,
                  // margin: "auto",
                  // marginTop: { xs: 20, sm: 5, md: 5 },
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
                  Add Contact
                </Typography>
                <BillingAddressForm
                  values={values}
                  handleChange={handleChange}
                  isDifferentShipping={values.isDifferentShipping}
                  setFieldValue={setFieldValue}
                  handlecheckboxChange={(e) =>
                    setFieldValue("isDifferentShipping", e.target.checked)
                  }
                />
                <Grid size={20}>
                  <Button
                    type="submit"
                    variant="contained"
                    // color={success ? "success" : "primary"}
                    fullWidth
                    sx={{
                      backgroundColor: success
                        ? "#6a994e"
                        : theme.palette.secondary.main,
                      // Dark Grey (Neutral Look)
                      color: "white",
                      // "&:hover": { backgroundColor: "#669bbc" },
                      marginTop: 1,
                      boxShadow: "0px 4px 10px rgba(0,0,255,0.4)", // Blue shadow for the button
                      // "&:hover": {
                      //   boxShadow: "0px 6px 15px rgba(0,0,255,0.6)", // Stronger effect on hover
                      // },
                    }}
                  >
                    {success ? "Data Saved Successfully" : "Submit"}
                  </Button>
                </Grid>
              </Box>
            </motion.div>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
