import { useEffect, useState } from 'react';
import { Folder, ArrowBack } from '@mui/icons-material';
import { Box, Typography, Card, CardMedia, IconButton, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import StorageService from '../services/StorageService';
import FolderService from '../services/FolderService';
import FileService from '../services/FileService';
import FolderSidebar from '../components/FolderSidebar';
import DownloadIcon from '@mui/icons-material/Download';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import UploadModalTrigger from '../components/UploadModalTrigger';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SortIcon from '@mui/icons-material/Sort';
import { UserFile, UserFolder } from '../types/types';

export default function HomePage() {
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [files, setFiles] = useState<UserFile[]>([]);
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [openFullscreen, setOpenFullscreen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  const userId = StorageService.getCurrentUser();

  const loadFolderContents = (folderId: string | null) => {
    if (!userId) return;

    const validFolderId = folderId === null ? undefined : folderId;

    setSelectedFolders([]);
    setSelectedFiles([]);

    FolderService.getAll(userId, validFolderId)
      .then(setFolders)
      .catch((error) => console.error('Failed to fetch folders:', error));
  
    FileService.getAll(userId, validFolderId)
      .then(setFiles)
      .catch((error) => console.error('Failed to fetch files:', error));
  };

  useEffect(() => {
    loadFolderContents(null);
  }, []);

  const handleFolderClick = (folderId: string) => {
    setFolderHistory((prev) => [...prev, folderId]);
    loadFolderContents(folderId);
  };

  const handleBackClick = () => {
    setFolderHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      const previousFolderId = newHistory[newHistory.length - 1] || null;
      loadFolderContents(previousFolderId);
      return newHistory;
    });
  };

  const handleFileClick = (file: UserFile) => {
    FileService.download(userId, [file.fileId])
      .then((response) => {
        const blob = new Blob([response], { type: file.contentType });
        const url = URL.createObjectURL(blob);
        setFullscreenImage(url);
        setSelectedFile(file);
        setOpenFullscreen(true);
      })
      .catch((error) => console.error('Failed to fetch file:', error));
  };

  const handleDownload = () => {
    if (selectedFile && fullscreenImage) {
      const link = document.createElement('a');
      link.href = fullscreenImage;
      link.download = selectedFile.originalName;
      link.click();
    }
  };

  const handleCloseFullscreen = () => {
    if (fullscreenImage) {
      URL.revokeObjectURL(fullscreenImage);
    }
    setOpenFullscreen(false);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleBackClick} disabled={folderHistory.length === 0}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" ml={1}>
            Drive
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2} sx={{ marginRight: '60px' }}>
          <UploadModalTrigger />
          <Button variant="outlined" startIcon={<CreateNewFolderIcon />}>
            New Folder
          </Button>
          <Button variant="outlined" startIcon={<SortIcon />}>
            Sort
          </Button>
        </Box>
      </Box>

      <Box display="flex">
        <FolderSidebar userId={userId!} onFolderClick={handleFolderClick} />
        <Box display="flex" flexDirection="column" gap={4} flexWrap="wrap" mb={4} sx={{ flex: 1, paddingLeft: 2 }}>
          <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
            {folders.map((folder) => (
              <Box
                key={folder.folderId}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolderSelection(folder.folderId);
                }}
                onDoubleClick={() => handleFolderClick(folder.folderId)}
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                  width: 120,
                  cursor: 'pointer',
                  border: selectedFolders.includes(folder.folderId)
                    ? '2px solid #1976d2'
                    : '1px solid transparent',
                  borderRadius: 2,
                  p: 1,
                  backgroundColor: selectedFolders.includes(folder.folderId) ? '#e3f2fd' : 'transparent',
                  transition: 'background-color 0.3s ease, border 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #1976d2',
                  },
                }}
              >
                <Folder sx={{ fontSize: 60, color: '#1976d2' }} />
                <Typography variant="body1" noWrap>
                  {folder.name}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={4} flexWrap="wrap">
            {files.map((file) => (
              <Card
                key={file.fileId}
                sx={{
                  width: 120,
                  p: 1,
                  border: selectedFiles.includes(file.fileId)
                    ? '2px solid #1976d2'
                    : '1px solid transparent',
                  borderRadius: 2,
                  backgroundColor: selectedFiles.includes(file.fileId) ? '#e3f2fd' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, border 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #1976d2',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFileSelection(file.fileId);
                }}
                onDoubleClick={() => handleFileClick(file)}
              >
                <CardMedia
                  component="img"
                  height="60"
                  image={file.base64Thumbnail}
                  alt={file.originalName}
                  sx={{ objectFit: 'contain' }}
                />
                <Typography variant="body2" noWrap>
                  {file.originalName}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      <Dialog open={openFullscreen} onClose={handleCloseFullscreen} maxWidth="lg" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={fullscreenImage || ''} alt="Fullscreen Image" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} color="primary">
            <DownloadIcon />
          </Button>
          <Button onClick={handleCloseFullscreen} color="secondary">
            <CloseFullscreenIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}