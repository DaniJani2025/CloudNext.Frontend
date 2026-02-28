import { useState } from 'react';
import { TextField, Button, Typography, Alert, Container, Paper, Box } from '@mui/material';
import UserService from '../services/UserService';

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await UserService.requestPasswordReset({ email });

      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.errorMessage || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          mx: 'auto',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: '1px solid rgba(15, 106, 184, 0.16)',
          bgcolor: 'rgba(255,255,255,0.88)',
        }}
      >
      {submitted ? (
        <Box>
          <Typography variant="h6" color="success.main">
            A Reset Password link has been sent to your email.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check your inbox (and spam folder) for the password reset link.
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Reset Your Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.1 }}
          >
            Send Reset Link
          </Button>
        </form>
      )}
      </Paper>
    </Container>
  );
}

export default RequestPasswordResetPage;
