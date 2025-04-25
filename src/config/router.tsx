import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/registration",
        element: <RegistrationPage />,
      },
    ],
  },
]);

export { routes };
