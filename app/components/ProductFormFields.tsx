import React from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import Grid from "@mui/material/Grid2";
interface ProductFormValues {
    name: string;
    description: string;
    price: string;
    stock: string;
    image_url: string;
    product_code: string;
    manufacturer: string;
    warranty_period: string;
    shipping_weight: string;
    product_condition: string;
    availability_status: string;
  }

interface ProductFormFieldsProps {
  formik: ReturnType<typeof useFormik<ProductFormValues>>;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ formik }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <TextField
          label="Product Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          fullWidth
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          fullWidth
          required
          inputProps={{ step: "0.01" }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formik.values.stock}
          onChange={formik.handleChange}
          fullWidth
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Product Code"
          name="product_code"
          value={formik.values.product_code}
          onChange={formik.handleChange}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Manufacturer"
          name="manufacturer"
          value={formik.values.manufacturer}
          onChange={formik.handleChange}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Warranty Period (Months)"
          name="warranty_period"
          value={formik.values.warranty_period}
          onChange={formik.handleChange}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Shipping Weight (kg)"
          name="shipping_weight"
          value={formik.values.shipping_weight}
          onChange={formik.handleChange}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel>Product Condition</InputLabel>
          <Select
            name="product_condition"
            value={formik.values.product_condition}
            onChange={formik.handleChange}
            label="Product Condition"
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Refurbished">Refurbished</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel>Availability Status</InputLabel>
          <Select
            name="availability_status"
            value={formik.values.availability_status}
            onChange={formik.handleChange}
            label="Availability Status"
          >
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            <MenuItem value="Pre-Order">Pre-Order</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ProductFormFields;