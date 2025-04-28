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
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserService from '../services/UserService';
import { AxiosError } from 'axios';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleRegistration = async () => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setTimeout(() => setEmailError(''), 5000);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setTimeout(() => setConfirmPasswordError(''), 5000);
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setTimeout(() => setPasswordError(''), 5000);
      return;
    }

    try {
      const response = await UserService.register({ email, password });

      if (response?.success && response?.result) {
        navigate('/login');
      } else {
        setError(response?.errorMessage || 'Registration failed');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        console.log('Error occurred during registration:', err.response?.data?.errorMessage || err.message);
        setError(err.response?.data?.errorMessage || 'Registration failed');
      } else {
        console.log('Unexpected error:', err);
        setError('Registration failed');
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
              error={!!emailError}
              helperText={emailError}
            />
            <FormControl fullWidth variant="outlined" margin="normal" error={!!passwordError}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
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
              {passwordError && (
                <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>
                  {passwordError}
                </div>
              )}
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal" error={!!confirmPasswordError}>
              <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirm-password"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
                sx={{
                  '& input': {
                    WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc',
                  },
                }}
              />
              {confirmPasswordError && (
                <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>
                  {confirmPasswordError}
                </div>
              )}
            </FormControl>
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
