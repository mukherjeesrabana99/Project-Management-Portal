import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Alert,
  Fab,
  Tooltip,
  InputAdornment,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { getAllClients, createClient, updateClient, deleteClient } from "../../../services/admin/client";

export const ClientManagement = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });
  const [errors, setErrors] = useState({});

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: getAllClients,
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });

  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return clients.filter((client) => {
      const name = (client.name ?? client.contact_person ?? client.company_name ?? "").toLowerCase();
      const email = (client.email ?? "").toLowerCase();
      const company = (client.company ?? client.company_name ?? "").toLowerCase();
      return (
        name.includes(term) ||
        email.includes(term) ||
        company.includes(term)
      );
    });
  }, [clients, searchTerm]);

  const handleOpen = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        address: client.address || "",
        company: client.company || "",
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        company: "",
      });
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Client name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      deleteMutation.mutate(clientId);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load clients. Please try again.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Client Management
        </Typography>
        <Typography color="text.secondary">
          Manage client information, contacts, and company details
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-clients"] })}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                fullWidth
              >
                Add Client
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Conatct Person</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Info</TableCell>
                 
                  <TableCell sx={{ fontWeight: 600 }}>Projects</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      Loading clients...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "secondary.main" }}>
                            <BusinessIcon />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>{client.company}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {client.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>{client.contact_person}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{client.email}</Typography>
                        {client.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {client.phone}
                          </Typography>
                        )}
                      </TableCell>
                     
                      <TableCell>
                        <Chip
                          label={client.project_count || 0}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit Client">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpen(client)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Client">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(client.id)}
                              disabled={deleteMutation.isLoading}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Client Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {editingClient ? "Edit Client" : "Create New Client"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                error={!!errors.company}
                helperText={errors.company}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                helperText="Optional contact number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                helperText="Optional company address"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={createMutation.isLoading || updateMutation.isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading
              ? (editingClient ? "Updating..." : "Creating...")
              : (editingClient ? "Update Client" : "Create Client")
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", md: "none" },
        }}
        onClick={() => handleOpen()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};