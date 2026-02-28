import { Outlet, useLocation } from 'react-router-dom';
import TopRightMenu from './TopRightMenu';
import StorageService from '../services/StorageService';

const Layout = () => {
  const location = useLocation();
  const isLoggedIn = StorageService.isLoggedIn();
  const isLoginOrRegisterPage =
    location.pathname === '/login' || location.pathname === '/registration';

  return (
    <div>
      {isLoggedIn && !isLoginOrRegisterPage && <TopRightMenu />}
      <main style={{ padding: '20px 20px 24px 20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
