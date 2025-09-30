import { useState, useEffect } from 'react';
import FolderService from '../services/FolderService';
import { Box, Collapse, List, ListItem, ListItemText, IconButton, ListItemButton, Tooltip } from '@mui/material';
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
    if(!folder.folderId) return;
    const isExpanded = expandedFolders.includes(folder.folderId);
  
    return (
      <div key={folder.folderId}>
        <ListItemButton
          sx={{ pl: 2 + depth * 2 }}
          onClick={() => {
            setHasFetchedHome(false);
            if (folder.folderId) {
              handleFolderClick(folder.folderId);
              handleToggleCollapse(folder.folderId);
            }

          }}
        >
          <Folder sx={{ mr: 1 }} />

          <Tooltip title={folder.name} placement="right">
            <ListItemText
              primary={folder.name}
              slotProps={{
                primary: {
                  noWrap: true,
                  sx: {
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                },
              }}
            />
          </Tooltip>

          {folder.subFolders?.length > 0 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                if (folder.folderId) {
                  handleToggleCollapse(folder.folderId);
                }
              }}
            >
              {isExpanded ? <ArrowDownward /> : <ArrowForward />}
            </IconButton>
          )}
        </ListItemButton>

        {folder.subFolders?.length > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {folder.subFolders.map((child) =>
              renderFolderNode(child, depth + 1)
            )}
          </Collapse>
        )}
      </div>
    );
};

  return (
    <Box sx={{ width: 250, borderRight: '1px solid #ccc', p: 2 }}>
      <ListItemButton
        onClick={() => {
          if (!hasFetchedHome) {
            getHome();
            setHasFetchedHome(true);
          }
          setHomeExpanded((prev) => !prev);
        }}
        sx={{ p: 1 }}
      >
        <Home sx={{ mr: 1 }} />

        <Tooltip title="Home" placement="right">
          <ListItemText
            primary="Home"
            slotProps={{
              primary: {
                noWrap: true,
                sx: {
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              },
            }}
          />
        </Tooltip>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setHomeExpanded((prev) => !prev);
          }}
        >
          {homeExpanded ? <ArrowDownward /> : <ArrowForward />}
        </IconButton>
      </ListItemButton>

      <Collapse in={homeExpanded} timeout="auto" unmountOnExit>
        <List disablePadding>
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
}

export default FolderSidebar;
