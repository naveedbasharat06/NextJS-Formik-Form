import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Box, IconButton, styled } from "@mui/material";
import { color } from "framer-motion";
import { Margin } from "@mui/icons-material";

// Styled component for the badge (optional customization)
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",


  },
}));

const ShoppingCartWithBadge: React.FC<{ itemCount: number }> = ({ itemCount }) => {
  return (
<Box sx={{margin:1}}>

      <StyledBadge badgeContent={itemCount} color="secondary">
        <ShoppingCartIcon  />
      </StyledBadge>
</Box>

  );
};

export default ShoppingCartWithBadge;