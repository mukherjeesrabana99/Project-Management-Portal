import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  Chip,
} from "@mui/material";
import { getUserProfile, updateUserProfile, changePassword } from "../../../services/authentication/profile";

export const Profile = () => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: localStorage.getItem("loggedRole") || "User",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const userMutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      setProfileMessage("Profile information saved successfully.");
      queryClient.invalidateQueries(["user-profile"]);
      setTimeout(() => setProfileMessage(""), 4000);
    },
  });

  const passwordMutation = useMutation(changePassword, {
    onSuccess: () => {
      setPasswordMessage("Password updated successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(""), 4000);
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
      }));
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    const currentErrors = {};
    if (!formData.name.trim()) currentErrors.name = "Full name is required.";
    if (!formData.email.trim()) currentErrors.email = "Email is required.";
    else if (!formData.email.includes("@")) currentErrors.email = "Enter a valid email address.";
    return currentErrors;
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    const currentErrors = validateProfile();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      await userMutation.mutateAsync({ name: formData.name, email: formData.email });
    }
  };

  const validatePassword = () => {
    const currentErrors = {};
    if (!passwordData.currentPassword.trim()) currentErrors.currentPassword = "Current password is required.";
    if (!passwordData.newPassword.trim()) currentErrors.newPassword = "New password is required.";
    else if (passwordData.newPassword.length < 6) currentErrors.newPassword = "Password must be at least 6 characters.";
    if (passwordData.confirmPassword !== passwordData.newPassword) currentErrors.confirmPassword = "Passwords do not match.";
    return currentErrors;
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    const currentErrors = validatePassword();
    setPasswordErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      await passwordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
    }
  };

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Unable to load profile.</Typography>
        <Typography color="text.secondary">Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", px: { xs: 1, md: 2 }, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              My Profile
            </Typography>
            <Typography color="text.secondary">
              Update your personal details and change your password from a single responsive page.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account details
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Keep your profile information current so teammates can contact you.
              </Typography>
              {profileMessage && <Alert severity="success" sx={{ mb: 2 }}>{profileMessage}</Alert>}
              <Box component="form" noValidate onSubmit={handleProfileSave}>
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    label="Role"
                    name="role"
                    value={formData.role}
                    fullWidth
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                  <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Save profile
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change password
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Enter your current password and choose a strong new password.
              </Typography>
              {passwordMessage && <Alert severity="success" sx={{ mb: 2 }}>{passwordMessage}</Alert>}
              <Box component="form" noValidate onSubmit={handlePasswordSave}>
                <Stack spacing={2}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword}
                  />
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword}
                  />
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                  />
                  <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Update password
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Profile summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Chip label={`Name: ${formData.name || "-"}`} sx={{ width: "100%", p: 2, justifyContent: "flex-start" }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Chip label={`Email: ${formData.email || "-"}`} sx={{ width: "100%", p: 2, justifyContent: "flex-start" }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Chip label={`Role: ${formData.role}`} sx={{ width: "100%", p: 2, justifyContent: "flex-start" }} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};