import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';

export default function UploadModalTrigger() {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFiles = (files) => {
    setUploadedFiles(Array.from(files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <UploadIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Files
          <IconButton onClick={() => setOpen(false)} sx={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              border: '2px dashed #1976d2',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
            }}
          >
            <Typography variant="body1" gutterBottom>
              Drag & drop files here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1 }}
            >
              Browse Files
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileInputChange}
              />
            </Button>
          </Box>

          {uploadedFiles.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Selected Files:</Typography>
              {uploadedFiles.slice(0, 3).map((file, idx) => (
                <Typography key={idx} variant="body2">
                  • {file.name}
                </Typography>
              ))}
              {uploadedFiles.length > 3 && (
                <Typography variant="body2" color="text.secondary">
                  +{uploadedFiles.length - 3} more
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
