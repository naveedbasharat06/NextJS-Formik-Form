"use client"
import React, { useEffect } from "react";
import supabase from "../../../utils/supabaseClient";
import { useFormik } from "formik";
import { Button, Typography, Container, Snackbar, Alert, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import ProductFormFields from "../../components/ProductFormFields";
import ImagePicker from "../../components/ImagePicker"; // Import the new ImagePicker component

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

const page: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const initialValues: ProductFormValues = {
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    product_code: "",
    manufacturer: "",
    warranty_period: "",
    shipping_weight: "",
    product_condition: "New",
    availability_status: "In Stock",
  };

  const uploadImageToSupabase = async (file: File) => {
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;
    const filePath = fileName;

    try {
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      if (!userId) {
        setError("User not authenticated.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let imageUrl = "";

        if (imageFile) {
          imageUrl = await uploadImageToSupabase(imageFile);
        }

        const { error } = await supabase.from("products").insert([
          {
            ...values,
            price: parseFloat(values.price),
            stock: parseInt(values.stock, 10),
            shipping_weight: parseFloat(values.shipping_weight),
            image_url: imageUrl,
            user_id: userId,
          },
        ]);

        if (error) throw error;

        setSuccess(true);
        formik.resetForm();
        setImageFile(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <>
    
    <Box
      sx={{
       
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "98vw",
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            marginTop: "150px",
            maxWidth: 600,
            padding: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0px 10px 30px rgba(0,0,255,0.4)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
              Add a New Product
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <ProductFormFields formik={formik} />
              <Box sx={{ mt: 2, mb: 2 }}>
                <ImagePicker onImageChange={setImageFile} />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !userId}
                fullWidth
                sx={{ mt: 2, backgroundColor: theme.palette.secondary.main }}
              >
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </form>
         
          </Container>
        </Box>
      </motion.div>
    </Box>

<Snackbar
open={success}
autoHideDuration={6000}
onClose={handleCloseSnackbar}
>
<Alert onClose={handleCloseSnackbar} severity="success">
  Product saved successfully!
</Alert>
</Snackbar>
<Snackbar
open={!!error}
autoHideDuration={6000}
onClose={handleCloseSnackbar}
>
<Alert onClose={handleCloseSnackbar} severity="error">
  {error}
</Alert>
</Snackbar>
</>
  );
};

export default page;