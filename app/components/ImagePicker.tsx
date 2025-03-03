import React from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Box, Typography } from "@mui/material";

interface ImagePickerProps {
  onImageChange: (file: FileWithPath | null) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageChange }) => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImageChange(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      alert("File must be an image and less than 5MB.");
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: "4px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          borderColor: "#777",
        },
      }}
    >
      <input {...getInputProps()} />
      {acceptedFiles.length > 0 ? (
        <Typography>
          Selected file: <strong>{acceptedFiles[0].name}</strong>
        </Typography>
      ) : (
        <Typography>
          Drag & drop an image here, or click to select one
        </Typography>
      )}
    </Box>
  );
};

export default ImagePicker;