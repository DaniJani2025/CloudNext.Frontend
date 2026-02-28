import { useEffect, useState } from 'react';
import { Folder, ArrowBack, Download as DownloadIcon, CloseFullscreen as CloseFullscreenIcon, Sort as SortIcon } from '@mui/icons-material';
import { Box, Typography, Card, CardMedia, IconButton, Dialog, DialogActions, DialogContent, Button, Tooltip } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import JSZip from 'jszip';

import StorageService from '../services/StorageService';
import FolderService from '../services/FolderService';
import FileService from '../services/FileService';
import FolderSidebar from '../components/FolderSidebar';
import UploadModalTrigger from '../components/UploadModalTrigger';
import NewFolderButton from '../components/NewFolderbutton';
import { UserFile, UserFolder } from '../types/types';
import { previewableMimeTypes } from '../constants/constants';
import React from 'react';


export default function HomePage() {
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [files, setFiles] = useState<UserFile[]>([]);
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [openFullscreen, setOpenFullscreen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [refreshSidebar, setRefreshSidebar] = useState(false);
  const [fullscreenVideo, setFullscreenVideo]     = useState<string | null>(null);
  const [openVideoFullscreen, setOpenVideoFullscreen] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<UserFolder[]>([]);

  const userId = StorageService.getCurrentUser() ?? "";

  const isVideo = (file: UserFile) =>
    /\.(mp4|mkv|webm)$/i.test(file.originalName);

  function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return previewableMimeTypes[ext] || '';
  }

  const buildPathToFolder = (folderId: string, current: UserFolder, path: UserFolder[] = []): UserFolder[] | null => {
    if (current.folderId === folderId) return [...path, current];
  
    for (const child of current.subFolders || []) {
      const result = buildPathToFolder(folderId, child, [...path, current]);
      if (result) return result;
    }
  
    return null;
  };  

  const loadFolderContents = (folderId: string | null) => {
    const validFolderId = folderId === null ? undefined : folderId;

    setSelectedFolders([]);
    setSelectedFiles([]);

    FolderService.getAll(userId, validFolderId)
      .then(setFolders)
      .catch((e) => console.error('Failed to fetch folders:', e));

    FileService.getAll(userId, validFolderId)
      .then(setFiles)
      .catch((e) => console.error('Failed to fetch files:', e));
  };

  useEffect(() => {
    loadFolderContents(null);
  }, []);

  const handleFolderClick = (folderId: string | null) => {
    if (!folderId) return;
    const currentFolderId = folderHistory[folderHistory.length - 1] ?? null;
    if (folderId === currentFolderId) return;

    setFolderHistory((prev) => [...prev, folderId]);
    loadFolderContents(folderId);
  
    FolderService.getStructure(userId).then((structure) => {
      const path = buildPathToFolder(folderId, {
        folderId: structure.folderId,
        name: "Home",
        virtualPath: '',
        subFolders: structure.subFolders,
      });
  
      if (path) setCurrentPath(path);
    });
  };

  const getHome = () => {
      setFolderHistory([]);
      setCurrentPath([
        {
          folderId: null,
          name: "Home",
          virtualPath: "",
          subFolders: [],
        },
      ]);

      FolderService.getAll(userId)
        .then(setFolders)
        .catch((error) => console.error('Failed to fetch folders:', error));

        FileService.getAll(userId)
        .then(setFiles)
        .catch((e) => console.error('Failed to fetch files:', e));
  };

  const handleBackClick = () => {
    setFolderHistory((prev) => {
      const h = [...prev];
      h.pop();
      const prevId = h[h.length - 1] || null;
      loadFolderContents(prevId);
      return h;
    });
  };

  const handleFileClick = (file: UserFile) => {
    const mime = getMimeType(file.originalName);
  
    if (isVideo(file)) {
      FileService.stream(file.fileId, userId)
        .then((resp) => {
          const blob = mime
            ? new Blob([resp], { type: mime })
            : new Blob([resp]);
          const url = URL.createObjectURL(blob);
          setFullscreenVideo(url);
          setFileName(file.originalName);
          setSelectedFile(file);
          setOpenVideoFullscreen(true);
        })
        .catch((e) => console.error('Failed to fetch video stream:', e));
    }  else if (mime.startsWith('image/')) {
      FileService.download(userId, [file.fileId])
        .then((resp) => {
          const blob = mime
            ? new Blob([resp], { type: mime })
            : new Blob([resp]);
          const url = URL.createObjectURL(blob);
          setFullscreenImage(url);
          setFileName(file.originalName);
          setSelectedFile(file);
          setOpenFullscreen(true);
        })
        .catch((e) => console.error('Failed to fetch file:', e));
    } else {
      setFullscreenImage(file.base64Thumbnail!);
      setFileName(file.originalName);
      setSelectedFile(file);
      setOpenFullscreen(true);
    }
  };  

  const handleCloseVideo = () => {
    if (fullscreenVideo) URL.revokeObjectURL(fullscreenVideo);
    setOpenVideoFullscreen(false);
  };

  const handleDownloadSelectedFiles = async () => {
    if (!userId || !selectedFiles.length) return;
  
    // === SINGLE FILE ===
    if (selectedFiles.length === 1) {
      const fileId = selectedFiles[0];
      const file = files.find((f) => f.fileId === fileId);
      if (!file) return;
  
      try {
        const resp = await FileService.download(userId, fileId);
        const mime2 = getMimeType(file.originalName);
        
        const blob = mime2
          ? new Blob([resp], { type: mime2 })
          : new Blob([resp]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.originalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
  
        setSelectedFiles([]);
      } catch (e) {
        console.error('Failed to download file:', e);
      }
  
      return;
    }
  
    // === MULTIPLE FILES ===
    try {
      const resp = await FileService.download(userId, selectedFiles);
      const zipBlob = new Blob([resp], { type: 'application/zip' });
      const zip = await JSZip.loadAsync(zipBlob);
      for (const name of Object.keys(zip.files)) {
        const f = zip.files[name];
        if (!f.dir) {
          const content = await f.async('blob');
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
      setSelectedFiles([]);
    } catch (e) {
      console.error('Failed to download files:', e);
    }
  };  

  const handleDownloadSelectedFolders = async () => {
    if (!userId || !selectedFolders.length) return;
    try {
      const folderId = selectedFolders[0];
      const zipBlob = await FolderService.download(userId, folderId);
      const url = URL.createObjectURL(zipBlob);
      const ts = new Date().toISOString().replace(/[-:.]/g, '');
      const fn = `folder_${ts}.zip`;
      const a = document.createElement('a');
      a.href = url; a.download = fn;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSelectedFolders([]);
    } catch (e) {
      console.error('Failed to download folder:', e);
    }
  };

  const handleDownload = () => {
    if (selectedFile && fullscreenImage) {
      const a = document.createElement('a');
      a.href = fullscreenImage;
      a.download = selectedFile.originalName;
      a.click();
    }
  };

  const handleCloseFullscreen = () => {
    if (fullscreenImage) URL.revokeObjectURL(fullscreenImage);
    setOpenFullscreen(false);
  };

  const toggleFileSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles((p) => p.filter((id) => id !== fileId));
    } else {
      setSelectedFolders([]);
      setSelectedFiles((p) => [...p, fileId]);
    }
  };

  const toggleFolderSelection = (folderId: string | null) => {
    if (!folderId) return;
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders([]);
    } else {
      setSelectedFiles([]);
      setSelectedFolders([folderId]);
    }
  };

  const refreshData = () => {
    const current = folderHistory[folderHistory.length - 1] || null;
    loadFolderContents(current);
    setRefreshSidebar((p) => !p);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2.5}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.74)',
          border: '1px solid rgba(15, 106, 184, 0.12)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleBackClick} disabled={!folderHistory.length}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" ml={1}>Drive</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5} sx={{ mr: 8 }}>
          <UploadModalTrigger parentFolderId={folderHistory[folderHistory.length - 1]} onUploadSuccess={refreshData} />
          <NewFolderButton parentFolderId={folderHistory[folderHistory.length - 1]} onUploadSuccess={refreshData} />
          <Button variant="outlined" startIcon={<SortIcon />}>Sort</Button>
        </Box>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          bgcolor: 'rgba(238, 247, 255, 0.92)',
          border: '1px solid rgba(15, 106, 184, 0.2)',
          borderRadius: 3,
          px: 2,
          py: 1,
          mb: 2.5,
        }}
      >
        <Typography>
          {selectedFiles.length + selectedFolders.length} {' '}
          {(selectedFiles.length + selectedFolders.length) === 1 ? 'item' : 'items'} selected
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            size="small"
            variant="contained"
            disabled={selectedFiles.length === 0}
            onClick={handleDownloadSelectedFiles}
          >
            Download Files
          </Button>

          <Button
            size="small"
            variant="contained"
            disabled={selectedFolders.length === 0}
            onClick={handleDownloadSelectedFolders}
          >
            Download Folder
          </Button>

          <Button
            size="small"
            variant="outlined"
            disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
            onClick={() => {
              setSelectedFiles([]);
              setSelectedFolders([]);
            }}
          >
            Clear Selection
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        <FolderSidebar userId={userId!} onFolderClick={handleFolderClick} refreshTrigger={refreshSidebar} getHome={getHome} />
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          gap={4}
          flexWrap="wrap"
          pl={1}
          pr={1}
          mb={4}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.58)',
            border: '1px solid rgba(15, 106, 184, 0.1)',
          }}
        >

          <Box display="flex" alignItems="center" gap={1} mb={2} pl={1}>
            {currentPath.map((folder, idx) => (
              <React.Fragment key={folder.folderId}>
                <Typography
                  sx={{ cursor: 'pointer', color: '#1976d2' }}
                  onClick={() => {
                      if (idx === 0) {
                        if (currentPath.length > 1) {
                          getHome();
                        }
                      } else {
                        handleFolderClick(folder.folderId);
                      }
                    }
                  }
                >
                  {idx === 0 ? 'Home' : folder.name}
                </Typography>
                {idx < currentPath.length - 1 && <Typography>/</Typography>}
              </React.Fragment>
            ))}
          </Box>

          <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
            {folders.map((f) => (
              <Box
                key={f.folderId}
                onClick={(e) => { e.stopPropagation(); toggleFolderSelection(f.folderId); }}
                onDoubleClick={(e) => { e.stopPropagation(); handleFolderClick(f.folderId); }}
                display="flex" flexDirection="column" alignItems="center"
                sx={{
                  width: 120, cursor: 'pointer',
                  border: selectedFolders.includes(f.folderId!) ? '2px solid #0f6ab8' : '1px solid rgba(15, 106, 184, 0.16)',
                  borderRadius: 3, p: 1,
                  bgcolor: selectedFolders.includes(f.folderId!) ? 'rgba(227, 242, 253, 0.92)' : 'rgba(255,255,255,0.65)',
                  transition: '0.2s',
                  '&:hover': { bgcolor: 'rgba(227, 242, 253, 0.92)', border: '2px solid #0f6ab8' },
                }}
              >
                <Folder sx={{ fontSize: 60, color: '#0f6ab8' }} />
                <Tooltip title={f.name}>
                  <Typography
                    noWrap
                    sx={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}
                  >
                    {f.name}
                  </Typography>
                </Tooltip>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={4} flexWrap="wrap">
            {files.map((file) => (
              <Card
                key={file.fileId}
                onClick={(e) => { e.stopPropagation(); toggleFileSelection(file.fileId); }}
                onDoubleClick={(e) => { e.stopPropagation(); handleFileClick(file); }}
                sx={{
                  width: 120, p: 1, cursor: 'pointer',
                  border: selectedFiles.includes(file.fileId) ? '2px solid #0f6ab8' : '1px solid rgba(15, 106, 184, 0.16)',
                  borderRadius: 3,
                  bgcolor: selectedFiles.includes(file.fileId) ? 'rgba(227, 242, 253, 0.92)' : 'rgba(255,255,255,0.7)',
                  transition: '0.2s',
                  '&:hover': { bgcolor: 'rgba(227, 242, 253, 0.92)', border: '2px solid #0f6ab8' },
                }}
              >
                <Box position="relative">
                  <CardMedia
                    component="img"
                    height="60"
                    image={file.base64Thumbnail}
                    alt={file.originalName}
                    sx={{ objectFit: 'contain' }}
                  />
                  {isVideo(file) && (
                    <PlayCircleFilledIcon
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 32,
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    />
                  )}
                </Box>
                <Typography noWrap>{file.originalName}</Typography>
              </Card>
            ))}
          </Box>

        </Box>
      </Box>

      <Dialog open={openFullscreen} onClose={handleCloseFullscreen} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
          {fullscreenImage && (
            <img
              src={fullscreenImage}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', alignItems: 'center', py: 1 }}>
          <Typography variant="subtitle1" sx={{ wordBreak: 'break-all', mb: 1 }}>
            {fileName}
          </Typography>
          <Box>
            <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
              Download
            </Button>
            <Button onClick={handleCloseFullscreen} startIcon={<CloseFullscreenIcon />}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={openVideoFullscreen} onClose={handleCloseVideo} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
          {fullscreenVideo && (
            <video
              src={fullscreenVideo}
              controls
              autoPlay
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', alignItems: 'center', py: 1 }}>
          <Typography variant="subtitle1" sx={{ wordBreak: 'break-all', mb: 1 }}>
            {fileName}
          </Typography>
          <Box>
            <Button
              onClick={() => {
                if (fullscreenVideo && selectedFile) {
                  const a = document.createElement('a');
                  a.href = fullscreenVideo;
                  a.download = selectedFile.originalName;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }}
              startIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <Button onClick={handleCloseVideo} startIcon={<CloseFullscreenIcon />}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
