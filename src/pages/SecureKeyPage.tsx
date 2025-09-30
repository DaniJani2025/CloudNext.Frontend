import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container, Card, CardContent, Typography, Box, Button, IconButton, InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { RouteUrls } from '../config/router';

const SecureKeyPage  = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recoveryKey, email, message } = location.state || {};
  const [copied, setCopied] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!recoveryKey) {
      navigate(RouteUrls.register);
    }
  }, [recoveryKey, email, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: { preventDefault: () => void; returnValue: string; }) => {
      if (!hasCopied) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setHasCopied(true);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card elevation={6} sx={{ p: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography variant="h5" color="primary" gutterBottom>
              Your Recovery Key
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              {message}
            </Typography>

            <Alert severity="warning" sx={{ mb: 2, width: '100%', textAlign: 'left' }}>
              ⚠️ <strong>Make sure to copy this now!</strong> You won’t see it again.
            </Alert>

            <FormControl fullWidth variant="outlined" margin="normal" sx={{ mb: 2 }}>
              <InputLabel htmlFor="recovery-key">Recovery Key</InputLabel>
              <OutlinedInput
                id="recovery-key"
                type="text"
                value={recoveryKey}
                disabled
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopy} edge="end">
                      {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Recovery Key"
                sx={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em',
                  '& input': { WebkitTextSecurity: 'disc' },
                }}
              />
            </FormControl>

            {copied && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Recovery key copied to clipboard!
              </Typography>
            )}
            
            {email && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                A verification link has been sent to <strong>{email}</strong>. Please check your inbox to verify your account.
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              fullWidth
              onClick={() => navigate(RouteUrls.login)}
              disabled={!hasCopied}
            >
              Continue to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SecureKeyPage;
