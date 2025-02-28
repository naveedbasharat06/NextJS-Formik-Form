"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Formik, Form } from "formik";

interface EditModalComponentProps {
  openEditModal: boolean;
  handleEditClose: () => void;
  updatedRow: any;
  handleSaveRow: (updatedRow: any) => void;

}

const UserEditModalComponent: React.FC<EditModalComponentProps> = ({
  openEditModal,
  handleEditClose,
  updatedRow,
  handleSaveRow,


}) => {
  const theme = useTheme();
//   const handleChange = (event) => {
//           const newRole = event.target.value;
//         //   setRole(newRole);
//         //   handleRoleChange(params.row.id, newRole);
//         };
  return (
    <Dialog open={openEditModal} onClose={handleEditClose}>
      <DialogTitle sx={{ marginBottom: 1 }}>Edit Record</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            id: updatedRow.id || "",
            role: updatedRow.role || "",
            email: updatedRow.email || "",
          }}
          onSubmit={(values) => {
            handleSaveRow({ ...updatedRow, ...values });
            handleEditClose();
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
              <Grid size={20}>

                  <TextField
                    disabled
                    label="ID"
                    name="id"
                    value={values.id}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ marginTop: 1.5 }}
                  />
                </Grid>

                <Grid size={20}>

{/* <TextField
  label="Role"
  name="role"
  value={values.role}
  onChange={handleChange}
  fullWidth
  required
/> */}
 <Select
 disabled
  name="role"
value={values.role}
onChange={handleChange}
fullWidth
size="small"
variant="outlined"
// displayEmpty
>
<MenuItem value="admin">Admin</MenuItem>
<MenuItem value="staff">Staff</MenuItem>
<MenuItem value="visitor">Visitor</MenuItem>
</Select>
</Grid>
                <Grid size={20}>

                  <TextField
                   
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="email"
                  />
                </Grid>
             
              </Grid>
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

export default UserEditModalComponent;
