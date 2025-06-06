import { GridColDef } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Define columns for the products table
export const getColumns4 = (
  handleEditOpen: (row: any) => void,
  user: any
): GridColDef[] => {
  return [
    {
      field: "actions",
      headerName: "Actionss",
      flex: 1,
      // minWidth: 100,
      // maxWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton onClick={() => handleEditOpen(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      // minWidth: 50,
      // maxWidth: 100,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      // minWidth: 150,
      // maxWidth: 300,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "display_name",
      headerName: "Display Name",
      flex: 1,
      // minWidth: 150,
      // maxWidth: 250,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "role",
      headerName: "User Role",
      flex: 1,
      // minWidth: 120,
      // maxWidth: 200,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "isCurrentUser",
      headerName: "Logged In",
      flex: 1,
      // minWidth: 100,
      // maxWidth: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (params.row.id === user?.id ? "LOGGED IN" : ""),
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
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton onClick={() => handleEditOpen(params.row)}>
          <EditIcon />
        </IconButton>
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
      field: "display_name",
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
      renderCell: (params) => (params.row.id === user?.id ? "LOGGED IN" : ""),
    },
  ];
};

export const getColumns2 = (
  handleShowMarker: (id: number, lng: number, lat: number) => void,
  deleteRow: (id: number) => void
): GridColDef[] => {
  return [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
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

export const getColumns5: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 250,
    sortable: false,
    headerClassName: "super-app-theme--header",
    renderCell: (params) => (
      <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "provider",
    headerName: "PROVIDER",
    flex: 1,
    sortable: false,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    width: 250,
    sortable: false,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "full_name",
    headerName: "Full Name",
    flex: 1,
    width: 180,
    sortable: false,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "avatar_url",
    headerName: "Avatar",
    flex: 1,
    width: 100,
    sortable: false,
    headerClassName: "super-app-theme--header",
    renderCell: (params) =>
      params.value ? (
        <img
          src={params.value}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ) : null,
  },
];

export const getColumns = (
  handleEditOpen: (row: any) => void,
  handleDelete: (id: number) => void
): GridColDef[] => {
  return [
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            sx={{ color: "#c1121f" }}
          >
            <DeleteIcon />
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
      field: "firstname",
      headerName: "Firstname",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "lastname",
      headerName: "Lastname",
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
      field: "isDifferentShipping",
      headerName: "Different Shipping",
      type: "boolean",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "shippingName",
      headerName: "Shipping Name",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "shippingAddress",
      headerName: "Shipping Address",
      flex: 1,
      sortable: false,
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
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            sx={{ color: "#c1121f" }}
          >
            <DeleteIcon />
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
      field: "name",
      headerName: "Product Name",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "image_url",
      headerName: "Image URL",
      flex: 1,
      sortable: false,
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
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "warranty_period",
      headerName: "Warranty (Months)",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "shipping_weight",
      headerName: "Shipping Weight (kg)",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
      type: "number",
    },
    {
      field: "product_condition",
      headerName: "Condition",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "availability_status",
      headerName: "Availability",
      flex: 1,
      sortable: false,
      headerClassName: "super-app-theme--header",
    },
  ];
};

export const gmailColumns: GridColDef[] = [
  {
    field: "from",
    headerName: "From",
    width: 150,
    sortable: false,
    headerClassName: "super-app-theme--header",
    renderCell: (params) => {
      const theme = useTheme();
      const fromText = params.row.from || "";
      const firstName = fromText.split(/\s|</)[0]; // Split by space or '<'
      const initial = firstName?.charAt(0)?.toUpperCase() || "?";
      const truncateString = (str: string, num: number) => {
        if (!str) return "";
        return str.length <= num ? str : str.slice(0, num) + "...";
      };
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 2, backgroundColor: theme.palette.secondary.main }}>
            {initial}
          </Avatar>
          <Typography variant="body2">
            {truncateString(firstName, 15)}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "subject",
    headerName: "Subject",
    flex: 1,
    width: 300,
    sortable: false,
    headerClassName: "super-app-theme--header",
    renderCell: (params) => (
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: params.row.isUnread ? "bold" : "normal" }}
      >
        {params.row.subject}
      </Typography>
    ),
  },
  // {
  //   field: "snippet",
  //   headerName: "Preview",
  //   width: 400,
  //   renderCell: (params) => (
  //     <Typography variant="body2">
  //       {truncateString(params.row.snippet, 100)}
  //     </Typography>
  //   ),
  // },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    sortable: false,
    headerClassName: "super-app-theme--header",
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="caption">{params.row.formattedDate}</Typography>
      </Box>
    ),
  },
];
