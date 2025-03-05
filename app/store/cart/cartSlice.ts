import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface CartItem extends Product {
  quantity: number; // Add quantity field
}

interface CartState {
  items: CartItem[];
  totalAmount: number; // Add totalAmount field
}

const initialState: CartState = {
  items: [],
  totalAmount: 0, // Initialize totalAmount to 0
};

// Helper function to calculate the total amount
const calculateTotalAmount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already exists
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // Add new item with quantity 1
      }
      // Recalculate total amount
      state.totalAmount = calculateTotalAmount(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Recalculate total amount
      state.totalAmount = calculateTotalAmount(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        // Recalculate total amount
        state.totalAmount = calculateTotalAmount(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0; // Reset total amount when cart is cleared
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
