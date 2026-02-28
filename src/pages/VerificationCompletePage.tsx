import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RouteUrls } from "../config/router";

const VerificationCompletePage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate(RouteUrls.login);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
      <Box
        sx={{
          p: 4,
          border: "1px solid rgba(15, 106, 184, 0.16)",
          borderRadius: 4,
          boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
          bgcolor: "rgba(255,255,255,0.88)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Email Verified!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your email has been successfully verified. You can now log in to your account.
        </Typography>
        <Button variant="contained" color="primary" sx={{ py: 1.1 }} onClick={handleLoginRedirect}>
          Go to Login
        </Button>
      </Box>
    </Container>
  );
};

export default VerificationCompletePage;
