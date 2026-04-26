import { Card, CardContent, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

export const StatCard = ({ title, value, color, icon }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          background: color,
          color: "#fff",
          p: 1.5,
          borderRadius: 2,
          mr: 2,
        }}
      >
        {icon}
      </Box>

      {/* Text */}
      <CardContent sx={{ p: 0 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};