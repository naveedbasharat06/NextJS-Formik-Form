import React from "react";
import { Alert, AlertColor } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

interface SuccessSnackbarProps {
  handleClose: () => void;
  openSnackbar: boolean;
  alertMessage: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  handleClose,
  openSnackbar,
  alertMessage,
  severity = "success",
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      aria-live="polite"
      aria-atomic="true"
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ 
          width: "100%",
          boxShadow: 3,
          fontSize: "1rem",
          alignItems: "center"
        }}
        role="alert"
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
