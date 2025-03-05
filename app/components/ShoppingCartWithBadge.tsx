// components/ShoppingCartWithBadge.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartModal from './ShoppingCartModal';

const ShoppingCartWithBadge: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Calculate total item count (including quantities)
  const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpenModal}>
        <Badge badgeContent={totalItemCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <ShoppingCartModal open={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ShoppingCartWithBadge;