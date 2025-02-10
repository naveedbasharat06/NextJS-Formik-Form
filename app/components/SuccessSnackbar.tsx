import React from "react";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

interface SuccessSnackbarProps {
  handleClose: () => void;
  openSnackbar: boolean;
  alertMessage: string;
}

const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  handleClose,
  openSnackbar,
  alertMessage,
}) => {
  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuccessSnackbar;
