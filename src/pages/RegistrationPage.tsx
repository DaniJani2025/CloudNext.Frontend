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

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      const response = await UserService.register({ email, password });

      if (response?.success && response?.result) {
        console.log('Registration Success!');
        navigate('/login');
      } else {
        setError(response?.errorMessage || 'Registration failed');
      }
    } catch (err: unknown) {
      console.log(`Error ${err}`);
      setError('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Card elevation={4}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" gutterBottom>
              Register
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
              onClick={handleRegistration}
              sx={{ mt: 3 }}
            >
              Register
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Already registered?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegistrationPage;
