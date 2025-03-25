"use client";

import DataGridComponent from "../../components/DataGridComponent";
import React, { useEffect, useState } from "react";
import { getProductColumns } from "../../constants/datagridColumnsName";
import ProtectRoutes from "../../components/ProtectRoutes";
import supabase from "../../utils/supabaseClient";
import { GridRowsProp } from "@mui/x-data-grid";
import ProductEditModalComponent from "../../components/ProductsEditModal";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import DeleteModalComponent from "../../components/DeleteModalComponent";
import {
  Box,
  CircularProgress,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

function Page() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updatedRow, setUpdatedRow] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackString, setSnackString] = useState<string>("");
  const [deleteid, setDeleteid] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the current user's ID and role
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); // Set the user ID

        // Fetch the user's role from the profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          setUserRole(profile.role); // Set the user's role
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch products from the database
  useEffect(() => {
    if (!userId || !userRole) return; // Skip if user ID or role is not available

    const fetchProducts = async () => {
      let query = supabase.from("products").select("*");

      // If the user is not an admin, filter by user_id
      if (userRole !== "admin") {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setRows(data);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [userId, userRole]); // Re-fetch when userId or userRole changes

  // Handlers for edit and delete
  const handleEditOpen = (row: any) => {
    setUpdatedRow(row);
    setOpenEditModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteid(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteid);
    if (error) {
      console.error(error);
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteid));
      setOpen(false);
      setSnackOpen(true);
      setSnackString("Data Deleted Successfully");
    }
  };

  const handleSaveRow = async (updatedRow: any) => {
    const { error } = await supabase
      .from("products")
      .update(updatedRow)
      .eq("id", updatedRow.id);

    if (error) {
      console.error(error);
    } else {
      setSnackString("data Updated Successfully");
      setSnackOpen(true);
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setOpenEditModal(false);
    }
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  // Get columns for the products table
  const columns = getProductColumns(handleEditOpen, handleDelete);

  return (
    <>
      <ProtectRoutes>
        <Typography
          sx={{
            marginTop: 4,
            fontSize: "2.5rem", // Larger font size for better visibility
            fontWeight: "bold", // Bold text
            color: (theme) => theme.palette.primary.main, // Use theme's primary color
            textAlign: "center", // Center align the text
            textTransform: "uppercase", // Uppercase text
            letterSpacing: "0.15em", // Increased letter spacing for emphasis
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)", // Add a shadow effect for depth
            transition: "color 0.3s, transform 0.3s", // Smooth transitions
            "&:hover": {
              color: (theme) => theme.palette.secondary.main, // Use theme's secondary color on hover
              transform: "scale(1.05)", // Slight scaling effect on hover
            },
          }}
        >
          PRODUCTS
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2, // Full viewport height
            width: "100%",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Full viewport height
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DataGridComponent
                rows={rows}
                columns={columns}
                AddProductsButton={true} // Only the additional button will show
                width={"80vw"}
              />
            </motion.div>
          )}
        </Box>
        {updatedRow && (
          <ProductEditModalComponent
            openEditModal={openEditModal}
            handleEditClose={() => setOpenEditModal(false)}
            updatedRow={updatedRow}
            handleSaveRow={handleSaveRow}
          />
        )}
        ;
        <DeleteModalComponent
          open={open}
          setOpen={setOpen}
          confirmDelete={confirmDelete}
        />
        <SuccessSnackbar
          handleClose={handleClose}
          openSnackbar={snackOpen}
          alertMessage={snackString}
        />
      </ProtectRoutes>
    </>
  );
}

export default Page;
