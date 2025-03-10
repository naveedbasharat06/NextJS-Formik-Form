import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  Box,
  Typography,
  Button,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  ListItemAvatar,
  Avatar,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { removeFromCart, updateQuantity } from "../store/cart/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { motion, AnimatePresence } from "framer-motion";

interface ShoppingCartModalProps {
  open: boolean;
  onClose: () => void;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleBuyNow = async () => {
    try {
      // Call the backend to create a Checkout Session
      const response = await fetch(
        // "http://localhost:3001/create-checkout-session",
        "https://nodejs-backend-ob7w.onrender.com/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: cartItems }),
        }
      );

      const { id } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: id });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 400,
              height: "100%",
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[24],
              padding: theme.spacing(4),
              overflowY: "auto",
            }}
          >
            {/* Close Icon */}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: theme.palette.text.primary,
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom sx={{ borderBottom: 2 }}>
              Shopping Cart
            </Typography>

            {/* Empty Cart Message and Image */}
            {cartItems.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  Your cart is empty.
                </Typography>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" // Replace with your image URL
                  alt="Empty Cart"
                  style={{
                    width: "60%",
                    maxWidth: 200,
                    marginTop: theme.spacing(2),
                  }}
                />
              </Box>
            )}

            {/* Cart Items */}
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.image_url}
                      alt={item.name}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${(item.price * item.quantity).toFixed(2)}`}
                  />
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    inputProps={{ min: 1 }}
                    sx={{ width: 80, mr: 2 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {/* Total Amount and Buy Now Button */}
            {cartItems.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  pt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </Box>
            )}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCartModal;
