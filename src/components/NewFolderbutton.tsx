import { Button, TextField, Modal, Box, Typography } from '@mui/material';
import { useState } from 'react';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderService from '../services/FolderService';
import StorageService from '../services/StorageService';

interface NewFolderButtonProps {
    parentFolderId: string | null;
    onUploadSuccess: () => void;
  }
  
const NewFolderButton: React.FC<NewFolderButtonProps> = ({ parentFolderId, onUploadSuccess }) => {
    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
  
    const handleOpen = () => {
      setOpen(true);
      setFolderName('');
    };
  
    const handleClose = () => {
      setOpen(false);
      setFolderName('');
    };
  
    const handleCreateFolder = async () => {
      try {
        const userId = StorageService.getCurrentUser();
        const response = await FolderService.createFolder(userId, folderName, parentFolderId);
        
        if (response && response.message === "Folder created successfully.") {
          onUploadSuccess();
          handleClose();
        } else {
          console.error('Failed to create folder:', response?.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    };
  
    return (
      <>
        <Button variant="outlined" startIcon={<CreateNewFolderIcon />} onClick={handleOpen}>
          New Folder
        </Button>
  
        <Modal open={open} onClose={handleClose}>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
            <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                Create New Folder
              </Typography>
              <TextField
                label="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateFolder}
                  disabled={!folderName.trim()}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </>
    );
  };
  
  export default NewFolderButton;
  