import { GridColDef } from "@mui/x-data-grid";
import { Button, MenuItem, Select, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";


// Define columns for the products table


// import supabase from "../utils/supabaseClient";

export const getColumns4 = (
  handleEditOpen: (row: any) => void,
  // handleDelete: (id: number) => void
  // handleRoleChange:
  user:any
): GridColDef[] => {
  return [

    {
      field: "actions",
      headerName: "Actions",
      width: 70, // Fixed width for action buttons
      // sortable: false,
      // disableColumnMenu: true,
      // headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton>
            <EditIcon 
            onClick={() => handleEditOpen(params.row)} 
            />
          </IconButton>
          {/* <IconButton>
            <DeleteIcon
              // onClick={() => handleDelete(params.row.id)}
              sx={{ color: "#c1121f" }}
            />
          </IconButton> */}
        </>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      flex:1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "display_name", // Add display_name column
      headerName: "Display Name",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "role",
      headerName: "User Role",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      // renderCell: (params) => {
      //   const [role, setRole] = useState(params.value || "visitor"); // Default role

      //   const handleChange = (event) => {
      //     const newRole = event.target.value;
      //     setRole(newRole);
      //     handleRoleChange(params.row.id, newRole);
      //   };

      //   return (
      //     <Select
      //       value={role}
      //       onChange={handleChange}
      //       fullWidth
      //       size="small"
      //       variant="outlined"
      //       displayEmpty
      //     >
      //       <MenuItem value="admin">Admin</MenuItem>
      //       <MenuItem value="staff">Staff</MenuItem>
      //       <MenuItem value="visitor">Visitor</MenuItem>
      //     </Select>
      //   );
      // },
    },

    {
      field: "isCurrentUser",
      headerName: "Logged In",
      flex:1,
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => {
        return params.row.id === user?.id ? "LOGGED IN" : "";
      },
    },
  
  ];
};


export const getColumns3 = (
  handleEditOpen: (row: any) => void,
  user: any
): GridColDef[] => {
  return [
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton>
            <EditIcon onClick={() => handleEditOpen(params.row)} />
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "display_name", // Add display_name column
      headerName: "Display Name",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "role",
      headerName: "User Role",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "isCurrentUser",
      headerName: "Logged In",
      flex: 1,
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => {
        return params.row.id === user?.id ? "LOGGED IN" : "";
      },
    },
  ];
};


export const getColumns2 = (
  handleShowMarker: (id: number, lng: number, lat: number) => void,
  deleteRow: (id: number) => void
) => {
  return [
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <>
          <IconButton
            size="small"
            onClick={() => deleteRow(params.row.id)}
            sx={{ color: "#c1121f" }}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={() =>
              handleShowMarker(
                params.row.id,
                params.row.latitude,
                params.row.longitude
              )
            }
            sx={{ color: "#1976d2" }}
          >
            {params.row.showEyeIcon ? (
              <VisibilityIcon />
            ) : (
              <VisibilityOffIcon />
            )}
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "address",
      headerName: "Address",

      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "latitude",
      headerName: "Latitude",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "longitude",
      headerName: "Longitude",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
  ];
};

export const getColumns = (
  handleEditOpen: (row: any) => void,
  handleDelete: (id: number) => void
): GridColDef[] => {
  return [
    {
      field: "actions",
      headerName: "Actions",
      width: 120, // Fixed width for action buttons
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton>
            <EditIcon onClick={() => handleEditOpen(params.row)} />
          </IconButton>
          <IconButton>
            <DeleteIcon
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: "#c1121f" }}
            />
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 50, // Fixed width for ID
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      hideable: false,
    },
    {
      field: "firstname",
      headerName: "Firstname",
      flex: 1, // Make it flexible
      minWidth: 100, // Prevent shrinking too much
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "lastname",
      headerName: "Lastname",
      flex: 1,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2, // Give it more space
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "isDifferentShipping",
      headerName: "Different Shipping",
      type: "boolean",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "shippingName",
      headerName: "Shipping Name",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "shippingAddress",
      headerName: "Shipping Address",
      flex: 2,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
  ];
};


export const getProductColumns = (
  handleEditOpen: (row: any) => void,
  handleDelete: (id: number) => void
): GridColDef[] => {
  return [
    {
      field: "actions",
      headerName: "Actions",
      width: 120, // Fixed width for action buttons
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton>
            <EditIcon onClick={() => handleEditOpen(params.row)} />
          </IconButton>
          <IconButton>
            <DeleteIcon
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: "#c1121f" }}
            />
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 50, // Fixed width for ID
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      hideable: false,
    },
    {
      field: "name",
      headerName: "Product Name",
      flex: 1, // Make it flexible
      minWidth: 150, // Prevent shrinking too much
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2, // Give it more space
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      type: "number",
      // valueFormatter: (params) => `$${params.value.toFixed(2)}`, // Format as currency
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "image_url",
      headerName: "Image URL",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      field: "product_code",
      headerName: "Product Code",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "warranty_period",
      headerName: "Warranty (Months)",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "shipping_weight",
      headerName: "Shipping Weight (kg)",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "product_condition",
      headerName: "Condition",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "availability_status",
      headerName: "Availability",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
  ];
};