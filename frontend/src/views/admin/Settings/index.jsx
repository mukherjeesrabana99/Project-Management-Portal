import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { changePassword } from "../../../services/authentication/profile";

export const Settings = () => {
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [config, setConfig] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    maintenanceMode: false,
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordMessage("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(""), 4000);
    },
  });

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword.trim()) errors.currentPassword = "Current password is required.";
    if (!passwordForm.newPassword.trim()) errors.newPassword = "New password is required.";
    else if (passwordForm.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters.";
    if (passwordForm.confirmPassword !== passwordForm.newPassword) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const errors = validatePasswordForm();
    setPasswordErrors(errors);
    if (Object.keys(errors).length === 0) {
      await passwordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
    }
  };

  const handleConfigChange = (event) => {
    const { name, checked } = event.target;
    setConfig((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <Box sx={{ width: "100%", px: { xs: 1, md: 2 }, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Settings
            </Typography>
            <Typography color="text.secondary">
              Change your password and manage basic system configuration options.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change password
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Enter your current password and choose a strong new password.
              </Typography>
              {passwordMessage && <Alert severity="success" sx={{ mb: 2 }}>{passwordMessage}</Alert>}
              <Box component="form" noValidate onSubmit={handlePasswordSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword}
                  />
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword}
                  />
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                  />
                  <Button type="submit" variant="contained" disabled={passwordMutation.isPending}>
                    Update password
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic system configuration
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Set system-level options for internal notifications and maintenance mode.
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.emailNotifications}
                      onChange={handleConfigChange}
                      name="emailNotifications"
                    />
                  }
                  label="Email notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.twoFactorAuth}
                      onChange={handleConfigChange}
                      name="twoFactorAuth"
                    />
                  }
                  label="Require two-factor authentication"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.maintenanceMode}
                      onChange={handleConfigChange}
                      name="maintenanceMode"
                    />
                  }
                  label="Maintenance mode"
                />
                <Typography variant="body2" color="text.secondary">
                  These settings are currently stored locally in the browser for demonstration.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};