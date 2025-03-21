import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface FilterComponentProps {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void; // Add onSearch prop
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filterText,
  onFilter,
  onSearch,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <TextField
        id="search"
        type="text"
        placeholder="Search"
        value={filterText}
        onChange={onFilter}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" onClick={onSearch}>
        Search
      </Button>
    </Box>
  );
};

export default FilterComponent;
