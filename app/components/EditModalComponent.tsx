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

interface EditModalComponentProps {
  openEditModal: boolean;
  handleEditClose: () => void;
  updatedRow: any;
  handleSaveRow: (updatedRow: any) => void;
}

const EditModalComponent: React.FC<EditModalComponentProps> = ({
  openEditModal,
  handleEditClose,
  updatedRow,
  handleSaveRow,
}) => {
  const theme = useTheme();
  return (
    <Dialog open={openEditModal} onClose={handleEditClose}>
      <DialogTitle sx={{ marginBottom: 1 }}>Edit Record</DialogTitle>
      <DialogContent>
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
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  sx={{ color: theme.palette.text.primary }}
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
