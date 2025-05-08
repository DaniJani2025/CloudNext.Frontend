import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import RequestPasswordResetPage from '../pages/RequestPasswordResetPage';
import VerificationComplete from '../pages/VerificationComplete';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfilePage from '../pages/ProfilePage';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/registration",
        element: <RegistrationPage />,
      },
      {
        path: "/forgot-password",
        element: <RequestPasswordResetPage />,
      },
      {
        path: "/verification-complete",
        element: <VerificationComplete />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

export { routes };
