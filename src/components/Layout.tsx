import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <main style={{ padding: '20px 20px 24px 20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
