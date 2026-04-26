
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    
        color: "primary.main",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Project Management Portal
        </Typography>

        <Button
          variant="contained"
          size="large"
          color="primary" 
          
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Landing;