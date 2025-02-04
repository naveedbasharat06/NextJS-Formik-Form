"use client";
import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Formik, Form } from "formik";
import BillingAddressForm from "@/components/billingAddressForm";

const FormComponent = () => {
  const [isDifferentShipping, setIsDifferentShipping] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          name: "",
          address: "",
          shippingName: "",
          shippingAddress: "",
        }}
        onSubmit={(values) => {
          console.log("First Name:", values.firstName);
          console.log("Last Name:", values.lastName);
          console.log("Email:", values.email);
          console.log("Different Shipping Address:", isDifferentShipping);
          console.log("Name:", values.name);
          console.log("Address:", values.address);
          console.log("Shipping Name:", values.shippingName);
          console.log("Shipping Address:", values.shippingAddress);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              sx={{
                maxWidth: 600,
                margin: "auto",
                marginTop: {
                  xs: 20,
                  sm: 5,
                  md: 5,
                },
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#ffffff",
              }}
            >
              <Grid container spacing={2}>
                <Grid size={20}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={20}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={20}>
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

                <BillingAddressForm
                  values={values}
                  handleChange={handleChange}
                  isDifferentShipping={isDifferentShipping}
                  setIsDifferentShipping={setIsDifferentShipping}
                />
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormComponent;
