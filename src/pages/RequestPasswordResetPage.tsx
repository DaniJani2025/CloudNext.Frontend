import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with real API call
    await fakeApiRequest(email);

    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', marginTop: '100px' }}>
      {submitted ? (
        <Typography variant="h6" color="success.main">
          A reset link has been sent to your email.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Reset Your Password
          </Typography>
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

async function fakeApiRequest(email: string) {
  console.log('Sending reset request for:', email);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export default RequestPasswordResetPage;
