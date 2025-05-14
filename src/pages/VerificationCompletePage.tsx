import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VerificationCompletePage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Box sx={{ p: 4, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          Email Verified!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your email has been successfully verified. You can now log in to your account.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLoginRedirect}>
          Go to Login
        </Button>
      </Box>
    </Container>
  );
};

export default VerificationCompletePage;