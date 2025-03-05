// components/ShoppingCartModal.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, updateQuantity } from '../store/cart/cartSlice';

interface ShoppingCartModalProps {
  open: boolean;
  onClose: () => void;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ open, onClose }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 400,
          height: '100%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Shopping Cart
        </Typography>
        <List>
          {cartItems.map((item) => (
            <ListItem key={item.id}>
              {/* Product Image */}
              <ListItemAvatar>
                <Avatar
                  src={item.image_url}
                  alt={item.name}
                  sx={{ width: 56, height: 56, mr: 2 }} // Adjust size and margin
                />
              </ListItemAvatar>
              {/* Product Details */}
              <ListItemText
                primary={item.name}
                secondary={`$${(item.price * item.quantity).toFixed(2)}`}
              />
              {/* Quantity Input */}
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value))
                }
                inputProps={{ min: 1 }}
                sx={{ width: 80, mr: 2 }}
              />
              {/* Delete Button */}
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
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ShoppingCartModal;