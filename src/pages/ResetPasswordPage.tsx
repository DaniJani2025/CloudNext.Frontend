import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import { RouteUrls } from '../config/router';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    if (!token) {
      setError('No reset token provided in URL.');
    }
  }, [token]);

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
        const { newRecoveryKey } = resp.result;
        setSuccess(true);
        navigate(RouteUrls.secureKey, {
          state: {
            recoveryKey: newRecoveryKey,
            message: 'Your password was reset successfully! This is your NEW recovery key, save it securely.',
          }
        });
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

  if (success) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Password Reset Successful
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You can now log in with your new password.
          </Typography>
          <Button variant="contained" onClick={() => navigate(RouteUrls.login)}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

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

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="recovery-key">Recovery Key</InputLabel>
              <OutlinedInput
                id="recovery-key"
                type="text"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowRecoveryKey(!showRecoveryKey)} edge="end">
                      {showRecoveryKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Recovery Key"
                sx={{
                  '& input': {
                    WebkitTextSecurity: showRecoveryKey ? 'none' : 'disc',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="new-password">New Password</InputLabel>
              <OutlinedInput
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
                sx={{
                  '& input': {
                    WebkitTextSecurity: showNewPassword ? 'none' : 'disc',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal" error={newPassword !== confirmPassword}>
              <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirm-password"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
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
              {newPassword !== confirmPassword && (
                <FormHelperText>Passwords must match</FormHelperText>
              )}
            </FormControl>

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
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
