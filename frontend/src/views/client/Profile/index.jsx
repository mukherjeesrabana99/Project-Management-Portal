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
  Divider,
} from "@mui/material";
import { getUserProfile, updateUserProfile, changePassword } from "../../../services/authentication/profile";
import { getClientProfile, updateClientProfile } from "../../../services/client/client";

export const Profile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
  });

  const { data: clientProfile, isLoading: clientLoading, isError: clientError } = useQuery({
    queryKey: ["client-profile"],
    queryFn: getClientProfile,
    staleTime: 1000 * 60 * 5,
    enabled: !!profile?.client_id,
  });

  const [userForm, setUserForm] = useState({ name: "", email: "" });
  const [clientForm, setClientForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [userMessage, setUserMessage] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [userErrors, setUserErrors] = useState({});
  const [clientErrors, setClientErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setUserForm({ name: profile.name || "", email: profile.email || "" });
    }
  }, [profile]);

  useEffect(() => {
    if (clientProfile) {
      setClientForm({
        company_name: clientProfile.company_name || "",
        contact_person: clientProfile.contact_person || "",
        email: clientProfile.email || "",
        phone: clientProfile.phone || "",
        address: clientProfile.address || "",
      });
    }
  }, [clientProfile]);

  const userMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      setUserMessage("Your personal profile has been updated.");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setTimeout(() => setUserMessage(""), 4000);
    },
  });

  const clientMutation = useMutation({
    mutationFn: updateClientProfile,
    onSuccess: () => {
      setClientMessage("Company profile has been updated.");
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      setTimeout(() => setClientMessage(""), 4000);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordMessage("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(""), 4000);
    },
  });

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (event) => {
    const { name, value } = event.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateUserForm = () => {
    const errors = {};
    if (!userForm.name.trim()) errors.name = "Full name is required.";
    if (!userForm.email.trim()) errors.email = "Email is required.";
    else if (!userForm.email.includes("@")) errors.email = "Enter a valid email address.";
    return errors;
  };

  const validateClientForm = () => {
    const errors = {};
    if (!clientForm.company_name.trim()) errors.company_name = "Company name is required.";
    if (!clientForm.contact_person.trim()) errors.contact_person = "Contact person is required.";
    if (!clientForm.email.trim()) errors.email = "Company email is required.";
    else if (!clientForm.email.includes("@")) errors.email = "Enter a valid company email.";
    return errors;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword.trim()) errors.currentPassword = "Current password is required.";
    if (!passwordForm.newPassword.trim()) errors.newPassword = "New password is required.";
    else if (passwordForm.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters.";
    if (passwordForm.confirmPassword !== passwordForm.newPassword) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    const errors = validateUserForm();
    setUserErrors(errors);
    if (Object.keys(errors).length === 0) {
      await userMutation.mutateAsync(userForm);
    }
  };

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    const errors = validateClientForm();
    setClientErrors(errors);
    if (Object.keys(errors).length === 0) {
      await clientMutation.mutateAsync(clientForm);
    }
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

  if (profileError || clientError) {
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
              Client Profile
            </Typography>
            <Typography color="text.secondary">
              Review and update your personal and company contact details from one central page.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal details
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Update your own name and email address used for login and notifications.
              </Typography>
              {userMessage && <Alert severity="success" sx={{ mb: 2 }}>{userMessage}</Alert>}
              <Box component="form" noValidate onSubmit={handleUserSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={userForm.name}
                    onChange={handleUserChange}
                    fullWidth
                    error={!!userErrors.name}
                    helperText={userErrors.name}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleUserChange}
                    fullWidth
                    error={!!userErrors.email}
                    helperText={userErrors.email}
                  />Pen
                  <Button type="submit" variant="contained" disabled={userMutation.isLoading}>
                    Save personal details
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
                Company details
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Manage the company profile used for client activity and contact information.
              </Typography>
              {clientMessage && <Alert severity="success" sx={{ mb: 2 }}>{clientMessage}</Alert>}
              <Box component="form" noValidate onSubmit={handleClientSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Company Name"
                    name="company_name"
                    value={clientForm.company_name}
                    onChange={handleClientChange}
                    fullWidth
                    error={!!clientErrors.company_name}
                    helperText={clientErrors.company_name}
                  />
                  <TextField
                    label="Contact Person"
                    name="contact_person"
                    value={clientForm.contact_person}
                    onChange={handleClientChange}
                    fullWidth
                    error={!!clientErrors.contact_person}
                    helperText={clientErrors.contact_person}
                  />
                  <TextField
                    label="Company Email"
                    name="email"
                    type="email"
                    value={clientForm.email}
                    onChange={handleClientChange}
                    fullWidth
                    error={!!clientErrors.email}
                    helperText={clientErrors.email}
                  />
                  <TextField
                    label="Contact Phone"
                    name="phone"
                    value={clientForm.phone}
                    onChange={handleClientChange}
                    fullWidth
                  />
                  <TextField
                    label="Address"
                    name="address"
                    value={clientForm.address}
                    onChange={handleClientChange}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                  <Button type="submit" variant="contained" disabled={clientMutation.isPending}>
                    Save company details
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change password
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Update your login password. Use a strong new password and confirm it below.
              </Typography>
              {passwordMessage && <Alert severity="success" sx={{ mb: 2 }}>{passwordMessage}</Alert>}
              <Box component="form" noValidate onSubmit={handlePasswordSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
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
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={passwordMutation.isPending}>
                  Update password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Current details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography>{userForm.name || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography>{userForm.email || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                <Typography>{clientForm.company_name || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Contact Person</Typography>
                <Typography>{clientForm.contact_person || "-"}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};