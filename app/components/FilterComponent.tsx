import React from 'react';
import { TextField, useTheme } from '@mui/material';

interface FilterComponentProps {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filterText, onFilter }) => {
  const theme = useTheme();

  return (
    <TextField
      id="search"
      type="text"
      placeholder="Filter By Name, Email, or Age"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      variant="outlined"
      sx={{
    marginBottom: 2,
        width: '20%',
     
        color: theme.palette.text.primary,
        
      }}
    />
  );
};

export default FilterComponent;