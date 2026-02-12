import { useState } from 'react';
import { TextField, Button, Typography, Alert } from '@mui/material';
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
    <div style={{ maxWidth: 400, margin: '0 auto', marginTop: '100px' }}>
      {submitted ? (
        <>
          <Typography variant="h6" color="success.main">
            A Reset Password link has been sent to your email.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check your inbox (and spam folder) for the password reset link.
          </Typography>
        </>
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
            sx={{ mt: 2 }}
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}

export default RequestPasswordResetPage;
