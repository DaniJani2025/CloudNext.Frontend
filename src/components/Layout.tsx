import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box component="main" sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 3 } }}>
      <Outlet />
    </Box>
  );
};

export default Layout;
