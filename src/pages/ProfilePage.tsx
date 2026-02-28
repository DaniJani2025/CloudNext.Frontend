import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      p={2}
    >
      <Card
        sx={{
          minWidth: 360,
          padding: 3,
          borderRadius: 4,
          border: '1px solid rgba(15, 106, 184, 0.16)',
          bgcolor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 16px 30px rgba(15, 23, 42, 0.08)',
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 84, height: 84, margin: "0 auto", mb: 2, bgcolor: '#0f6ab8' }}>
            {email?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {email || "User Email"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Logged in user profile
          </Typography>
          <Button variant="outlined" color="primary">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
