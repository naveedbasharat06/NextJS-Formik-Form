import React, { useEffect } from "react";
import {
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

// Define a more specific interface for the form values
interface FormValues {
  name: string;
  address: string;
  shippingName: string;
  shippingAddress: string;
  firstname: string;
  lastname: string;
  email: string;
  isDifferentShipping: boolean;
}

interface BillingAddressFormProps {
  values: FormValues;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlecheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDifferentShipping: boolean;
  setFieldValue: (field: string, value: any) => void;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  values,
  handleChange,
  isDifferentShipping,
  handlecheckboxChange,
  setFieldValue,
}) => {
  useEffect(() => {
    if (!isDifferentShipping) {
      setFieldValue("shippingName", "");
      setFieldValue("shippingAddress", "");
    }
  }, [isDifferentShipping, setFieldValue]);
  
  const theme = useTheme();
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={20}>
          <TextField
            label="First Name"
            name="firstname"
            value={values.firstname}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: 1.5 }}
            aria-required="true"
            aria-label="First Name"
            inputProps={{ "aria-label": "First Name" }}
          />
        </Grid>

        <Grid size={20}>
          <TextField
            label="Last Name"
            name="lastname"
            value={values.lastname}
            onChange={handleChange}
            fullWidth
            required
            aria-required="true"
            aria-label="Last Name"
            inputProps={{ "aria-label": "Last Name" }}
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
            aria-required="true"
            aria-label="Email"
            inputProps={{ "aria-label": "Email" }}
          />
        </Grid>
      </Grid>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDifferentShipping}
              onChange={handlecheckboxChange}
              name="isDifferentShipping"
              aria-label="Use different shipping address"
            />
          }
          label="Different Shipping Address"
        />
      </FormGroup>

      <Grid container spacing={1}>
        <Grid size={isDifferentShipping ? 6 : 6}>
          <FormLabel id="billing-address-label">Billing Address</FormLabel>
          <FormHelperText>Enter your billing information</FormHelperText>

          <TextField
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: 1 }}
            aria-required="true"
            aria-labelledby="billing-address-label"
            inputProps={{ "aria-label": "Billing Name" }}
          />
          <TextField
            label="Address"
            name="address"
            value={values.address}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: 1 }}
            aria-required="true"
            aria-labelledby="billing-address-label"
            inputProps={{ "aria-label": "Billing Address" }}
          />
        </Grid>

        {isDifferentShipping && (
          <Grid size={6}>
            <FormLabel id="shipping-address-label">Shipping Address</FormLabel>
            <FormHelperText>Enter your shipping information</FormHelperText>
            <TextField
              label="Name"
              name="shippingName"
              value={values.shippingName}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginTop: 1 }}
              aria-required="true"
              aria-labelledby="shipping-address-label"
              inputProps={{ "aria-label": "Shipping Name" }}
            />
            <TextField
              label="Address"
              name="shippingAddress"
              value={values.shippingAddress}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginTop: 1 }}
              aria-required="true"
              aria-labelledby="shipping-address-label"
              inputProps={{ "aria-label": "Shipping Address" }}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default BillingAddressForm;
