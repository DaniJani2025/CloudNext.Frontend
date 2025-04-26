import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import FileService from '../services/FileService';
import StorageService from '../services/StorageService';

export default function UploadModalTrigger({ parentFolderId, onUploadSuccess }: { parentFolderId: string | null, onUploadSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<'files' | 'folder' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const userId = StorageService.getCurrentUser();

  const handleFiles = (files: FileList | ArrayLike<File>) => {
    const fileArray = Array.from(files);
    console.log('Selected Files:', fileArray);
    setUploadedFiles(fileArray);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const resetModal = () => {
    setOpen(false);
    setUploadMode(null);
    setUploadedFiles([]);
    setIsUploading(false);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      console.error('No files selected');
      return;
    }

    setIsUploading(true);
    try {
      await FileService.upload(uploadedFiles, userId, parentFolderId);
      resetModal();
      onUploadSuccess();
      // optionally: show success toast
    } catch (error) {
      console.error('Upload failed', error);
      setIsUploading(false);
      // optionally: show error toast
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => setOpen(true)}
      >
        Upload
      </Button>

      <Dialog open={open} onClose={resetModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload
          <IconButton onClick={resetModal} sx={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {uploadMode === null ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setUploadMode('files')}
                fullWidth
              >
                Upload Files
              </Button>
              <Button
                variant="contained"
                onClick={() => setUploadMode('folder')}
                fullWidth
              >
                Upload Folder
              </Button>
            </Box>
          ) : (
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
                Drag & drop {uploadMode === 'files' ? 'files' : 'a folder'} here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 1 }}
              >
                Browse {uploadMode === 'files' ? 'Files' : 'Folder'}
                <input
                  type="file"
                  hidden
                  multiple={uploadMode === 'files'}
                  //@ts-ignore
                  webkitdirectory={uploadMode === 'folder' ? 'true' : undefined}
                  onChange={handleFileInputChange}
                />
              </Button>
            </Box>
          )}

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
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={uploadedFiles.length === 0 || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}