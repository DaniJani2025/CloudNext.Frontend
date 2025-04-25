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
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
