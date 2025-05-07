import { useState, useEffect } from 'react';
import FolderService from '../services/FolderService';
import { Box, Collapse, List, ListItem, ListItemText, IconButton, ListItemButton } from '@mui/material';
import { Folder, ArrowForward, ArrowDownward, Home } from '@mui/icons-material';
import { UserFolder } from '../types/types';
import StorageService from '../services/StorageService';

interface FolderSidebarProps {
  userId: string;
  onFolderClick: (folderId: string) => void;
  refreshTrigger: boolean;
  getHome: () => void;
}

const FolderSidebar: React.FC<FolderSidebarProps> = (props) => {
  const { userId, onFolderClick, refreshTrigger, getHome } = props;
  const [folderStructure, setFolderStructure] = useState<UserFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [homeExpanded, setHomeExpanded] = useState(false);
  const [hasFetchedHome, setHasFetchedHome] = useState(false);

  const loadFolderStructure = () => {
    if (userId) {
      FolderService.getStructure(userId)
        .then((data) => {
          if (Array.isArray(data.subFolders)) {
            setFolderStructure(data.subFolders);
            StorageService.setUserFolder(data.folderId);
          } else {
            console.error('Expected subFolders to be an array.');
          }
        })
        .catch((error) => console.error('Failed to fetch folder structure:', error));
    }
  };

  useEffect(() => {
    loadFolderStructure();
  }, [userId]);

  useEffect(() => {
    loadFolderStructure();
  }, [refreshTrigger]);

  const handleFolderClick = (folderId: string) => {
    onFolderClick(folderId);
  };

  const handleToggleCollapse = (folderId: string) => {
    setExpandedFolders((prevExpanded) =>
      prevExpanded.includes(folderId)
        ? prevExpanded.filter((id) => id !== folderId)
        : [...prevExpanded, folderId]
    );
  };

  const renderFolderNode = (folder: UserFolder, depth = 0) => {
    const isExpanded = expandedFolders.includes(folder.folderId);
  
    return (
      <div key={folder.folderId}>
        <ListItemButton
          sx={{ pl: 2 + depth * 2 }}
          onClick={() => {
            setHasFetchedHome(false);
            handleFolderClick(folder.folderId);
            handleToggleCollapse(folder.folderId);
          }}
        >
          <Folder sx={{ mr: 1 }} />
          <ListItemText primary={folder.name} />
  
          {folder.subFolders?.length > 0 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCollapse(folder.folderId);
              }}
            >
              {isExpanded ? <ArrowDownward /> : <ArrowForward />}
            </IconButton>
          )}
        </ListItemButton>
  
        {folder.subFolders?.length > 0 && (
          <Collapse in={isExpanded}>
            {folder.subFolders.map((child) =>
              renderFolderNode(child, depth + 1)
            )}
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <Box sx={{ width: 250, borderRight: '1px solid #ccc', padding: 2 }}>
      <ListItemButton
        onClick={() => {
          if (!hasFetchedHome) {
            getHome();
            setHasFetchedHome(true);
          }
          setHomeExpanded((prev) => !prev);
        }}
        sx={{ padding: 1 }}
      >
        <Home sx={{ marginRight: 1 }} />
        <ListItemText primary="Home" />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setHomeExpanded((prev) => !prev);
          }}
        >
          {homeExpanded ? <ArrowDownward /> : <ArrowForward />}
        </IconButton>
      </ListItemButton>

      <Collapse in={homeExpanded}>
        <List>
          {folderStructure.length > 0 ? (
            folderStructure.map((rootFolder) => renderFolderNode(rootFolder))
          ) : (
            <ListItem>
              <ListItemText primary="No folders available." />
            </ListItem>
          )}
        </List>
      </Collapse>
    </Box>
  );
};

export default FolderSidebar;
