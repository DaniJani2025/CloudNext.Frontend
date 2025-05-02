import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import JSZip from 'jszip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import FolderService from '../services/FolderService';
import StorageService from '../services/StorageService';
import FileService from '../services/FileService';
import { EXCLUDED_FILES } from '../constants/constants';
import { allowedUploadMimeTypes } from '../constants/constants';


export default function UploadModalTrigger({ parentFolderId, onUploadSuccess }: { parentFolderId: string | null, onUploadSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<'files' | 'folder' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const userId = StorageService.getCurrentUser();

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleFiles = (files: FileList | ArrayLike<File>) => {
    const fileArray = Array.from(files);
    const allowed: File[] = [];
    const rejected: string[] = [];
  
    fileArray.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (allowedUploadMimeTypes[ext]) {
        allowed.push(file);
      } else {
        rejected.push(file.name);
      }
    });
  
    if (rejected.length) {
      setRejectedFiles(rejected);
      setOpenSnackbar(true);
    }
  
    setUploadedFiles(allowed);
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

  const handleFolderUpload = async (folderFiles: FileList | ArrayLike<File>) => {
    const zip = new JSZip();
    const folderName = folderFiles[0]?.webkitRelativePath?.split('/')[0] || 'folder';
    const folder = zip.folder(folderName);
  
    Array.from(folderFiles).forEach((file) => {
      const filename = file.name.toLowerCase();
      const ext = filename.split('.').pop() || '';
      if (EXCLUDED_FILES.includes(filename) || !allowedUploadMimeTypes[ext]) {
        return;
      }

      const relativePathParts = file.webkitRelativePath.split('/').slice(1);
      const relativePath = relativePathParts.join('/');
      folder?.file(relativePath, file);
    });
  
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const targetFolderId = parentFolderId ?? StorageService.getUserFolder();
  
    await FolderService.upload(userId, targetFolderId, zipBlob);
  };

  const handleUpload = async () => {
    setIsUploading(true);

    if (uploadMode === 'folder' && uploadedFiles.length > 0) {
      try {
        await handleFolderUpload(uploadedFiles);
        resetModal();
        onUploadSuccess();
      } catch (error) {
        console.error('Folder upload failed', error);
        setIsUploading(false);
      }
    } else if (uploadedFiles.length > 0) {
      try {
          await FileService.upload(uploadedFiles, userId, parentFolderId);
          resetModal();
          onUploadSuccess();
      } catch (error) {
        console.error('Upload failed', error);
        setIsUploading(false);
      }
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
                  webkitdirectory={uploadMode === 'folder' ? 'true' : undefined}
                  onChange={handleFileInputChange}
                />
              </Button>
            </Box>
          )}

          {uploadedFiles.length > 0 && uploadMode === 'folder' && (
            <Box mt={2}>
              <Typography variant="subtitle1">Selected Folder:</Typography>
              <Typography variant="body2">
                • {uploadedFiles[0]?.webkitRelativePath.split('/')[0]}
              </Typography>
            </Box>
          )}
          {uploadedFiles.length > 0 && uploadMode === 'files' && (
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          These files were skipped: {rejectedFiles.join(', ')}
        </Alert>
      </Snackbar>
    </>
  );
}
