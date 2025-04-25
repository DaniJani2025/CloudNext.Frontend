import React, { useState, useEffect } from 'react';
import FolderService from '../services/FolderService';
import { Box, Button, Collapse, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Folder, ArrowForward, ArrowDownward } from '@mui/icons-material';

const FolderSidebar = ({ userId, onFolderClick }) => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([]);

  useEffect(() => {
    if (userId) {
      FolderService.getStructure(userId)
        .then((data) => {
          if (Array.isArray(data.subFolders)) {
            setFolderStructure(data.subFolders);
          } else {
            console.error('Expected subFolders to be an array.');
          }
        })
        .catch((error) => console.error('Failed to fetch folder structure:', error));
    }
  }, [userId]);

  const handleFolderClick = (folderId) => {
    onFolderClick(folderId);
  };

  const handleToggleCollapse = (folderId) => {
    setExpandedFolders((prevExpanded) =>
      prevExpanded.includes(folderId)
        ? prevExpanded.filter((id) => id !== folderId)
        : [...prevExpanded, folderId]
    );
  };

  return (
    <Box sx={{ width: 250, borderRight: '1px solid #ccc', padding: 2 }}>
      <List>
        {folderStructure.length > 0 ? (
          folderStructure.map((folder) => (
            <div key={folder.folderId}>
              <ListItem button onClick={() => handleFolderClick(folder.folderId)}>
                <Folder sx={{ marginRight: 1 }} />
                <ListItemText primary={folder.name} />
                
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCollapse(folder.folderId);
                  }}
                >
                  {expandedFolders.includes(folder.folderId) ? <ArrowDownward /> : <ArrowForward />}
                </IconButton>
              </ListItem>
              
              <Collapse in={expandedFolders.includes(folder.folderId)}>
                <List component="div" disablePadding>
                  {folder.subFolders &&
                    folder.subFolders.map((subFolder) => (
                      <ListItem
                        button
                        key={subFolder.folderId}
                        sx={{ paddingLeft: 4 }}
                        onClick={() => handleFolderClick(subFolder.folderId)}
                      >
                        <ListItemText primary={subFolder.name} />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </div>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No folders available." />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default FolderSidebar;
