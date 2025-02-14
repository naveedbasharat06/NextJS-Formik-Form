// utils/columns.ts
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// import supabase from "../utils/supabaseClient";

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
      field: "latitude",
      headerName: "Latitude",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "longitude",
      headerName: "Longitude",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "address",
      headerName: "Address",
      width: 400,
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
      field: "id",
      headerName: "ID",
      width: 10,
      sortable: false,
      disableColumnMenu: true,

      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "firstname",
      headerName: "Firstname",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "lastname",
      headerName: "Lastname",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "isDifferentShipping",
      headerName: "Different Shipping",
      type: "boolean",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "shippingName",
      headerName: "Shipping Name",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "shippingAddress",
      headerName: "Shipping Address",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 175,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEditOpen(params.row)}
            sx={{
              backgroundColor: "#669bbc", // Dark Grey (Neutral Look)
              color: "white",
              "&:hover": { backgroundColor: "#003049" }, // Slightly darker on hover
            }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{
              backgroundColor: "#c1121f", // Bright Red (Danger)
              color: "white",
              "&:hover": { backgroundColor: "#780000" }, // Darker red on hover
              marginLeft: 1,
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
};
