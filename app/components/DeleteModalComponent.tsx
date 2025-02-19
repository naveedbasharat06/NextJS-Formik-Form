// components/DeleteModalComponent.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this data? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          sx={{ color: theme.palette.text.primary }}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmDelete}
          sx={{ color: theme.palette.text.primary }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModalComponent;
