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
      bgcolor="#f4f6f8"
      p={2}
    >
      <Card sx={{ minWidth: 350, padding: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}>
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
