import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import { RouteUrls } from '../config/router';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // extract ?token=...
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No reset token provided in URL.');
    }
  }, [token]);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    try {
      const resp = await UserService.resetPassword({
        token,
        newPassword,
        recoveryKey
      });

      if (resp.success) {
        navigate(RouteUrls.login);
      } else {
        setError(resp.errorMessage || 'Failed to reset password.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const isDisabled =
    !newPassword ||
    !confirmPassword ||
    !recoveryKey ||
    newPassword !== confirmPassword ||
    !!error;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 4 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Reset Your Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box mt={1}>
          <TextField
            fullWidth
            label="Recovery Key"
            value={recoveryKey}
            onChange={(e) => setRecoveryKey(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            error={newPassword !== confirmPassword}
            helperText={
              newPassword !== confirmPassword ? 'Passwords must match' : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
