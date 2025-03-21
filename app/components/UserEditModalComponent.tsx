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
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Formik, Form } from "formik";
import ImagePicker from "./ImagePicker";
import supabase from "../utils/supabaseClient"; // Adjust the import path

interface EditModalComponentProps {
  openEditModal: boolean;
  handleEditClose: () => void;
  updatedRow: any;
  handleSaveRow: (updatedRow: any) => void;
  userRoles?: boolean;
}

const UserEditModalComponent: React.FC<EditModalComponentProps> = ({
  openEditModal,
  handleEditClose,
  updatedRow,
  handleSaveRow,
  userRoles,
}) => {
  const theme = useTheme();
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const handleSubmit = async (values: any) => {
    let photoUrl = updatedRow.photo_url; // Keep the existing photo URL if no new image is uploaded

    if (imageFile) {
      const userId = values.id; // Ensure this is the correct user ID
      const filePath = `profile_images/${userId}/${imageFile.name}`;

      // Upload the image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile_images") // Your Supabase Storage bucket name
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("profile_images")
        .getPublicUrl(filePath);

      photoUrl = publicUrlData.publicUrl;
    }

    // Update the profile in the database
    const { data, error } = await supabase
      .from("profiles")
      .update({
        role: values.role,
        email: values.email,
        display_name: values.display_name,
        photo_url: photoUrl,
      })
      .eq("id", values.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      handleSaveRow({ ...updatedRow, ...values, photo_url: photoUrl });
      handleEditClose();
    }
  };

  return (
    <Dialog open={openEditModal} onClose={handleEditClose}>
      <DialogTitle sx={{ marginBottom: 1 }}>Edit Record</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            id: updatedRow.id || "",
            role: updatedRow.role || "",
            email: updatedRow.email || "",
            display_name: updatedRow.display_name || "",
          }}
          onSubmit={handleSubmit}
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
                  <Select
                    disabled={!userRoles}
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
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

                <Grid size={20}>
                  <TextField
                    label="Display Name"
                    name="display_name"
                    value={values.display_name}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ marginTop: 1.5 }}
                  />
                </Grid>

                <Grid size={20}>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <ImagePicker onImageChange={setImageFile} />
                  </Box>
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
