// components/DeleteModalComponent.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this item? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={confirmDelete} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModalComponent;
