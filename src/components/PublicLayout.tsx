import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Outlet />
    </Box>
  );
};

export default PublicLayout;
