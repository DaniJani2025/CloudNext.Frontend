import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Link,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserService from '../services/UserService';
import StorageService from '../services/StorageService';
import { AxiosError } from 'axios';
import { RouteUrls } from '../config/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name
      .split(/[.\-_]/)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const handleLogin = async () => {
    try {
      const response = await UserService.login({ email, password });

      if (response?.success && response?.result) {
        const { token, userId, email, expiresAt } = response.result;

        StorageService.setAccessToken(token);
        StorageService.setCurrentUser(userId);
        StorageService.setUserDisplayName(getInitials(email));
        StorageService.setEmail(email);
        StorageService.setTokenExpiry(expiresAt);
        StorageService.setLoginStatus(true);
        navigate(RouteUrls.home);
      } else {
        setError(response?.errorMessage || 'Login failed');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        console.log('Error occurred during login:', err.response?.data?.errorMessage || err.message);
        setError(err.response?.data?.errorMessage || 'Login failed');
      } else {
        console.log('Unexpected error:', err);
        setError('Login failed');
      }
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Card
        elevation={0}
        sx={{
          p: { xs: 1, sm: 2 },
          borderRadius: 4,
          border: '1px solid rgba(15, 106, 184, 0.16)',
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255,255,255,0.86)',
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography variant="h5" color="primary" gutterBottom>
              Sign in to CloudNext
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ mt: 0.5 }}>
              Login
            </Typography>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                sx={{
                  '& input': {
                    WebkitTextSecurity: showPassword ? 'none' : 'disc',
                  },
                }}
              />
            </FormControl>

            <Box width="100%" display="flex" justifyContent="flex-end" mt={1}>
              <Link
                component={RouterLink}
                to={RouteUrls.forgotPassword}
                variant="body2"
                underline="hover"
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleLogin}
              sx={{ mt: 3, py: 1.1 }}
            >
              Login
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }} color="textSecondary">
              Not registered yet?{' '}
              <Link component={RouterLink} to="/registration" variant="body2">
                Sign up here
              </Link>
            </Typography>
                
            <Divider sx={{ width: '100%', my: 3 }}>OR</Divider>
              
            <Box display="flex" flexDirection="column" gap={1} width="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={() => console.log('OAuth login: Google clicked')}
                startIcon={
                  <img
                    src="/icons/google-logo.png"
                    alt="Google"
                    style={{ width: 20, height: 20 }}
                  />
                }
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Continue with Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => console.log('OAuth login: Facebook clicked')}
                startIcon={
                  <img
                    src="/icons/facebook-logo.png"
                    alt="Facebook"
                    style={{ width: 20, height: 20 }}
                  />
                }
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Continue with Facebook
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => console.log('OAuth login: Apple clicked')}
                startIcon={
                  <img
                    src="/icons/apple-logo.png"
                    alt="Apple"
                    style={{ width: 20, height: 20 }}
                  />
                }
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Continue with Apple
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
