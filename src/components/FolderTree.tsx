import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FolderTree = ({ folders }) => {
  return (
    <List>
      {folders.map((folder) => (
        <ListItem key={folder.folderId}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemText primary={folder.name} />
            </AccordionSummary>
            <AccordionDetails>
              {folder.subFolders && folder.subFolders.length > 0 && (
                <FolderTree folders={folder.subFolders} />
              )}
            </AccordionDetails>
          </Accordion>
        </ListItem>
      ))}
    </List>
  );
};

export default FolderTree;
