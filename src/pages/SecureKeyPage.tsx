import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container, Card, CardContent, Typography, Box, Button, IconButton, InputAdornment, TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RouteUrls } from '../config/router';

const SecureKeyPage  = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recoveryKey, email, message } = location.state || {};
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!recoveryKey) {
      navigate(RouteUrls.register);
    }
  }, [recoveryKey, email, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

            <TextField
              type="password"
              value={recoveryKey}
              fullWidth
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopy} edge="end">
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

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
