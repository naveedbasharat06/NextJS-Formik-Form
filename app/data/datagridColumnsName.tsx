// utils/columns.ts
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
// import supabase from "../utils/supabaseClient";

export const getColumns = (
  handleEditOpen: (row: any) => void,
  handleDelete: (id: number) => void
): GridColDef[] => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "firstname",
      headerName: "Firstname",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "lastname",
      headerName: "Lastname",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "isDifferentShipping",
      headerName: "Different Shipping",
      type: "boolean",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "shippingName",
      headerName: "Shipping Name",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "shippingAddress",
      headerName: "Shipping Address",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 165,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditOpen(params.row)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
};
