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
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import StorageService from '../services/StorageService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

        console.log('Login Success!');
        StorageService.setAccessToken(token);
        StorageService.setCurrentUser(userId);
        StorageService.setUserDisplayName(getInitials(email));
        StorageService.setEmail(email);
        StorageService.setTokenExpiry(expiresAt);
        StorageService.setLoginStatus(true);
        navigate('/');
      } else {
        setError(response?.errorMessage || 'Login failed');
      }
    } catch (err: unknown) {
      console.log(`Error ${err}`);
      setError('Login failed');
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
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
