import React, { useEffect } from "react";
import {
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

interface BillingAddressFormProps {
  values: {
    name: string;
    address: string;
    shippingName: string;
    shippingAddress: string;
    firstname: string;
    lastname: string;
    email: string;
    isDifferentShipping: boolean;
  };
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
      </Grid>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDifferentShipping}
              onChange={handlecheckboxChange}
              name="isDifferentShipping"
            />
          }
          label="Different Shipping Address"
        />
      </FormGroup>

      <Grid container spacing={1}>
        <Grid size={isDifferentShipping ? 6 : 6}>
          <FormLabel>Billing Address</FormLabel>

          <TextField
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: 1 }}
          />
          <TextField
            label="Address"
            name="address"
            value={values.address}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: 1 }}
          />
        </Grid>

        {isDifferentShipping && (
          <Grid size={6}>
            <FormLabel>Shipping Address</FormLabel>
            <TextField
              label="Name"
              name="shippingName"
              value={values.shippingName}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginTop: 1 }}
            />
            <TextField
              label="Address"
              name="shippingAddress"
              value={values.shippingAddress}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginTop: 1 }}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default BillingAddressForm;
