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
import BillingAddressForm from "./BillingAddressForm";
import { Formik, Form } from "formik";

// Define a proper interface for the form data
interface FormData {
  id: number;
  name: string;
  address: string;
  shippingName: string;
  shippingAddress: string;
  firstname: string;
  lastname: string;
  email: string;
  isDifferentShipping: boolean;
  [key: string]: any; // For any additional fields
}

interface EditModalComponentProps {
  openEditModal: boolean;
  handleEditClose: () => void;
  updatedRow: FormData;
  handleSaveRow: (updatedRow: FormData) => void;
}

const EditModalComponent: React.FC<EditModalComponentProps> = ({
  openEditModal,
  handleEditClose,
  updatedRow,
  handleSaveRow,
}) => {
  const theme = useTheme();
  return (
    <Dialog 
      open={openEditModal} 
      onClose={handleEditClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
    >
      <DialogTitle id="edit-dialog-title" sx={{ marginBottom: 1 }}>Edit Record</DialogTitle>
      <DialogContent id="edit-dialog-description">
        <Formik
          initialValues={updatedRow}
          enableReinitialize
          onSubmit={(values) => handleSaveRow(values)}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form>
              <BillingAddressForm
                values={values}
                handleChange={handleChange}
                isDifferentShipping={values.isDifferentShipping}
                setFieldValue={setFieldValue}
                handlecheckboxChange={(e) =>
                  setFieldValue("isDifferentShipping", e.target.checked)
                }
              />

              <DialogActions>
                <Button
                  onClick={handleEditClose}
                  sx={{ color: theme.palette.text.primary }}
                  aria-label="Cancel edit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  sx={{ color: theme.palette.text.primary }}
                  aria-label="Save changes"
                >
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditModalComponent;
