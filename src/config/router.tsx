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


export const RouteUrls = {
  home: "/",
  login: "/login",
  register: "/registration",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verificationComplete: "/verification-complete",
  profile: "/profile",
};


const routes = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: RouteUrls.login, element: <LoginPage /> },
      { path: RouteUrls.register, element: <RegistrationPage /> },
      { path: RouteUrls.forgotPassword, element: <RequestPasswordResetPage /> },
      { path: RouteUrls.resetPassword, element: <ResetPasswordPage /> },
      { path: RouteUrls.verificationComplete, element: <VerificationCompletePage /> },
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
          { path: RouteUrls.profile, element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export { routes };
