// components/DeleteModalComponent.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";

interface DeleteModalComponentProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  confirmDelete: () => void;
}

const DeleteModalComponent: React.FC<DeleteModalComponentProps> = ({
  open,
  setOpen,
  confirmDelete,
}) => {
  const theme = useTheme();
  
  const handleCancel = () => {
    setOpen(false);
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete this data? This action cannot be undone and all associated information will be permanently removed from the system.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          sx={{ 
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
          aria-label="Cancel deletion"
        >
          Cancel
        </Button>
        <Button
          onClick={confirmDelete}
          sx={{ 
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            }
          }}
          aria-label="Confirm deletion"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModalComponent;
