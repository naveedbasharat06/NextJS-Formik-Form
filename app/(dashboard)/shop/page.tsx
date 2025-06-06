"use client";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient"; // Adjust the import path
import Grid from "@mui/material/Grid2";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Button,
  SnackbarCloseReason,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cart/cartSlice"; // Adjust the import path
import { AppDispatch, RootState } from "../../store/store";
import SuccessSnackbar from "../../components/SuccessSnackbar";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const [snackString, setSnackString] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const theme = useTheme();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };
  const handleBuyNow = (product: Product) => {
    dispatch(addToCart(product)); // Dispatch the addToCart action
    setSnackString(`${product.name} added to cart!`);
    setSnackOpen(true);
  };
  // if (loading) {
  //   return <Typography>Loading...</Typography>;
  // }

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100vw",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              marginTop: 4,
              fontSize: "2.5rem", // Larger font size for better visibility
              fontWeight: "bold", // Bold text
              color: (theme) => theme.palette.primary.main, // Use theme's primary color
              textAlign: "center", // Center align the text
              textTransform: "uppercase", // Uppercase text
              letterSpacing: "0.15em", // Increased letter spacing for emphasis
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)", // Add a shadow effect for depth
              transition: "color 0.3s, transform 0.3s", // Smooth transitions
              "&:hover": {
                color: (theme) => theme.palette.secondary.main, // Use theme's secondary color on hover
                transform: "scale(1.05)", // Slight scaling effect on hover
              },
            }}
          >
            SHOP
          </Typography>
          <Container sx={{ py: 4 }}>
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid size={3} key={product.id}>
                  <Card
                    sx={{
                      height: "100%",

                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {product.image_url && (
                      <CardMedia
                        component="img"
                        sx={{
                          height: "200px", // Fixed height for all images
                          width: "100%", // Full width of the card
                          objectFit: "cover", // Ensure the image covers the area without distortion
                        }}
                        image={product.image_url}
                        alt={product.name}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2, // Limit to 2 lines
                          overflow: "hidden", // Hide overflow text
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.description}
                      </Typography>
                    </CardContent>
                    {/* Price at the bottom of the card */}
                    <CardContent
                      sx={{
                        borderTop: "1px solid #e0e0e0",
                        paddingTop: 2,
                        paddingBottom: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ textAlign: "right" }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: theme.palette.secondary.main,
                          color: "white",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                        onClick={() => handleBuyNow(product)}
                      >
                        ADD TO Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}

      <SuccessSnackbar
        handleClose={handleClose}
        openSnackbar={snackOpen}
        alertMessage={snackString}
      />
    </>
  );
};

export default Shop;
