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
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserService from '../services/UserService';
import StorageService from '../services/StorageService';
import { AxiosError } from 'axios';

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
        navigate('/');
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
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Card elevation={4}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" gutterBottom>
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
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleLogin}
              sx={{ mt: 3 }}
            >
              Login
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Not registered yet?{' '}
                <Link component={RouterLink} to="/registration" variant="body2">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
