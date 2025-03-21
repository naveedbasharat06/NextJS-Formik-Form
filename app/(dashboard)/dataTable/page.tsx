// pages/index.tsx
import React from 'react';
import DataTableComponent from '../../components/DataTableComponent';
import { Typography } from '@mui/material';

const page: React.FC = () => {
  return (
    <div>
             <Typography
  sx={{ 
    marginTop: 4, 
    fontSize: '2rem',        // Larger font size
    fontWeight: 'bold',     // Bold text
    color: 'primary.main',  // Use the primary color from your theme
    textAlign: 'center',    // Center align the text
    textTransform: 'uppercase', // Uppercase text
    letterSpacing: '0.1em', // Add some letter spacing

  }}
>
 DATA TABLE
</Typography>
      <DataTableComponent />
    </div>
  );
};

export default page;