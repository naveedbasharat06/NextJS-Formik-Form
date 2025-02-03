"use client";
import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  FormGroup,
  Box,
  FormLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";

const FormComponent = () => {
  const [isDifferentShipping, setIsDifferentShipping] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      name: "",
      address: "",
      shippingName: "",
      shippingAddress: "",
    },
    onSubmit: (values) => {
      console.log("First Name:", values.firstName);
      console.log("Last Name:", values.lastName);
      console.log("Email:", values.email);
      console.log("Different Shipping Address:", isDifferentShipping);
      console.log("Name:", values.name);
      console.log("Address:", values.address);
      console.log("Shipping Name:", values.shippingName);
      console.log("Shipping Address:", values.shippingAddress);
    },
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDifferentShipping(e.target.checked);
    formik.values.shippingName = "";
    formik.values.shippingAddress = "";
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        maxWidth: 600,
        margin: "auto",
        marginTop: {
          xs: 20, // 16px margin on extra small screens (mobile)
          sm: 5, // 24px margin on small screens
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
            value={formik.values.firstName}
            onChange={formik.handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid size={20}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid size={20}>
          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            fullWidth
            required
            type="email"
          />
        </Grid>

        <Grid container spacing={2} columns={16}>
          <Grid size={8}>
            <FormLabel>Billing Address</FormLabel>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDifferentShipping}
                    onChange={handleCheckboxChange}
                    name="differentShipping"
                  />
                }
                sx={{
                  color: "#000000",
                }}
                label="Different Shipping Address"
              />
            </FormGroup>

            <TextField
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              fullWidth
              required
            />

            <TextField
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              fullWidth
              required
              sx={{
                marginTop: 1,
              }}
            />
          </Grid>
          <Grid size={8}>
            <FormLabel>Shiping Address</FormLabel>

            {/* <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDifferentShipping}
                      onChange={handleCheckboxChange}
                      name="differentShipping1"
                    />
                  }
                  sx={{
                    color: "#000000",
                  }}
                  label="Different Shipping Address"
                />
              </FormGroup> */}

            {isDifferentShipping && (
              <>
                <TextField
                  label="Name"
                  name="shippingName"
                  value={formik.values.shippingName}
                  onChange={formik.handleChange}
                  fullWidth
                  required
                  sx={{
                    marginTop: 5.2,
                  }}
                />

                <TextField
                  label="Address"
                  name="shippingAddress"
                  value={formik.values.shippingAddress}
                  onChange={formik.handleChange}
                  fullWidth
                  required
                  sx={{
                    marginTop: 1,
                  }}
                />
              </>
            )}
          </Grid>
          {/* <Grid size={10}>
           
          </Grid>
          <Grid size={10}>
            
          </Grid> */}
        </Grid>

        <Grid size={20}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormComponent;
