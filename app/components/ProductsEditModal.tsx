"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Formik, Form } from "formik";

interface ProductEditModalComponentProps {
  openEditModal: boolean; // Controls modal visibility
  handleEditClose: () => void; // Function to close the modal
  updatedRow: any; // The product data to be edited
  handleSaveRow: (updatedRow: any) => void; // Function to save the updated product
 // Optional: List of product categories
}

const ProductEditModalComponent: React.FC<ProductEditModalComponentProps> = ({
  openEditModal,
  handleEditClose,
  updatedRow,
  handleSaveRow,
   // Default categories
}) => {
  const theme = useTheme();

  return (
    <Dialog open={openEditModal} onClose={handleEditClose}>
      <DialogTitle sx={{ marginBottom: 1 }}>Edit Product</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            id: updatedRow.id || "", // Product ID
            name: updatedRow.name || "", // Product name
            price: updatedRow.price || 0, // Product price
          description:updatedRow.description || "",
           // Product category
            stock: updatedRow.stock || 0, // Product stock
            product_code:updatedRow.product_code ||"",
            warranty_period:updatedRow.warranty_period ||0,
            manufacturer:updatedRow.manufacturer ||"",
            shipping_weight:updatedRow.shipping_weight ||0,
            product_condition:updatedRow.product_condition ||"",
            availability_status:updatedRow.availability_status ||"",

          }}
          onSubmit={(values) => {
            // Save the updated product data
            handleSaveRow({ ...updatedRow, ...values });
            handleEditClose(); // Close the modal
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Product ID (Disabled) */}
                <Grid size={20}>
                  <TextField
                    disabled
                    label="ID"
                    name="id"
                    value={values.id}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ marginTop: 1.5 }}
                  />
                </Grid>

             

                {/* Product Name */}
                <Grid size={20}>
                  <TextField
                    label="Product Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={20}>
                  <TextField
                   
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ marginTop: 1.5 }}
                  />
                </Grid>

                {/* Product Price */}
                <Grid size={20}>
                  <TextField
                    label="Price"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                  />
                </Grid>

                {/* Product Category */}
              

                {/* Product Stock */}
                <Grid size={20}>
                  <TextField
                    label="Stock"
                    name="stock"
                    value={values.stock}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                  />
                </Grid>

                <Grid size={20}>
                  <TextField
                    label="Product_code"
                    name="product_code"
                    value={values.product_code}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="text"
                  />
                </Grid>

                <Grid size={20}>
                  <TextField
                    label="Warranty_period"
                    name="warranty_period"
                    value={values.warranty_period}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                  />
                </Grid>

                <Grid size={20}>
                  <TextField
                    label="Manufacturer"
                    name="manufacturer"
                    value={values.manufacturer}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="text"
                  />
                </Grid>

                <Grid size={20}>
                  <TextField
                    label="Shipping_weight"
                    name="shipping_weight"
                    value={values.shipping_weight}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                  />
                </Grid>
                <Grid size={20}>
                  <TextField
                    label="Product_condition"
                    name="product_condition"
                    value={values.product_condition}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="text"
                  />
                </Grid>
                <Grid size={20}>
                  <TextField
                    label="Availability_status"
                    name="availability_status"
                    value={values.availability_status}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="text"
                  />
                </Grid>
              </Grid>

              {/* Dialog Actions (Cancel and Save Buttons) */}
              <DialogActions>
                <Button
                  onClick={handleEditClose}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  sx={{ color: theme.palette.text.primary }}
                >
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModalComponent;