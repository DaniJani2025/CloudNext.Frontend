import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default PublicLayout;
