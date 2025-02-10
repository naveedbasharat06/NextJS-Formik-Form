"use client";
import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import supabase from "../../utils/supabaseClient";
import { Formik, Form } from "formik";
import BillingAddressForm from "../components/billingAddressForm";
import { useRouter } from "next/navigation";

const FormComponent = () => {
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
              maxWidth: 600,
              margin: "auto",
              marginTop: { xs: 20, sm: 5, md: 5 },
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#ffffff",
            }}
          >
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
                color={success ? "success" : "primary"}
                fullWidth
                sx={{ marginTop: 1 }}
              >
                {success ? "Data Saved Successfully" : "Submit"}
              </Button>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
