import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import RequestPasswordResetPage from '../pages/RequestPasswordResetPage';
import VerificationCompletePage from '../pages/VerificationCompletePage';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfilePage from '../pages/ProfilePage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import PublicLayout from '../components/PublicLayout';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/registration", element: <RegistrationPage /> },
      { path: "/forgot-password", element: <RequestPasswordResetPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/verification-complete", element: <VerificationCompletePage /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export { routes };
