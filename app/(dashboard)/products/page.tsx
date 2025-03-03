"use client";

import DataGridComponent from "../../components/DataGridComponent";
import React, { useEffect, useState } from "react";
import { getProductColumns } from "../../constants/datagridColumnsName";
import ProtectRoutes from "../../components/ProtectRoutes";
import supabase from "../../../utils/supabaseClient";
import { GridRowsProp } from "@mui/x-data-grid";
import ProductEditModalComponent from "../../components/ProductsEditModal";

function Page() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updatedRow, setUpdatedRow] = useState<any>(null);

  // Fetch the current user's ID and role
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
      }
    };
    fetchProducts();
  }, [userId, userRole]); // Re-fetch when userId or userRole changes

  // Handlers for edit and delete
  const handleEditOpen = (row: any) => {
    setUpdatedRow(row);
    setOpenEditModal(true);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const handleSaveRow = async (updatedRow: any) => {
    const { error } = await supabase
      .from("products")
      .update(updatedRow)
      .eq("id", updatedRow.id);

    if (error) {
      console.error("Error updating product:", error);
    } else {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setOpenEditModal(false);
    }
  };

  // Get columns for the products table
  const columns = getProductColumns(handleEditOpen, handleDelete);

  return (
    <>
      <ProtectRoutes>
        <DataGridComponent
          rows={rows}
          columns={columns}
          AddProductsButton={true} // Only the additional button will show
        />
   { updatedRow && (
    <ProductEditModalComponent
      openEditModal={openEditModal}
      handleEditClose={() => setOpenEditModal(false)}
      updatedRow={updatedRow}
      handleSaveRow={handleSaveRow}
    />
  )};
      </ProtectRoutes>
    </>
  );
}

export default Page;