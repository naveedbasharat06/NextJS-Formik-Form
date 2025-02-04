import React from "react";
import {
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

interface BillingAddressFormProps {
  values: {
    name: string;
    address: string;
    shippingName: string;
    shippingAddress: string;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDifferentShipping: boolean;
  setIsDifferentShipping: (value: boolean) => void;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  values,
  handleChange,
  isDifferentShipping,
  setIsDifferentShipping,
}) => (
  <>
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={isDifferentShipping}
            onChange={(e) => {
              setIsDifferentShipping(e.target.checked);
              if (!e.target.checked) {
                values.shippingName = "";
                values.shippingAddress = "";
              }
            }}
            name="differentShipping"
          />
        }
        sx={{
          color: "#000000",
        }}
        label="Different Shipping Address"
      />
    </FormGroup>

    <Grid container spacing={1}>
      <Grid size={isDifferentShipping ? 6 : 6.16}>
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

    <Grid size={20}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 1 }}
      >
        Submit
      </Button>
    </Grid>
  </>
);

export default BillingAddressForm;
