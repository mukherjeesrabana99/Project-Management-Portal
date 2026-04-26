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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Alert,
  Fab,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getAllProjects, createProject, updateProjectStatus } from "../../../services/admin/project";

const statusColors = {
  planned: "#6366f1",
  active: "#22c55e",
  completed: "#10b981",
  on_hold: "#f59e0b",
};

const statusOptions = [
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

export const Projects = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: null,
    end_date: null,
    status: "planned",
    client_id: "",
    assigned_users: [],
  });
  const [errors, setErrors] = useState({});

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: getAllProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateProjectStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleOpen = () => {
    setFormData({
      name: "",
      description: "",
      start_date: null,
      end_date: null,
      status: "planned",
      client_id: "",
      assigned_users: [],
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      start_date: null,
      end_date: null,
      status: "planned",
      client_id: "",
      assigned_users: [],
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";
    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const projectData = {
      ...formData,
      start_date: formData.start_date?.toISOString().split('T')[0],
      end_date: formData.end_date?.toISOString().split('T')[0],
      assigned_users: JSON.stringify(formData.assigned_users),
    };

    createMutation.mutate(projectData);
  };

  const handleStatusChange = (projectId, newStatus) => {
    updateMutation.mutate({ id: projectId, status: newStatus });
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load projects. Please try again.</Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: "100%", p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Project Management
          </Typography>
          <Typography color="text.secondary">
            Create and manage all projects in your organization
          </Typography>
        </Box>

        {/* Filters and Search */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search projects..."
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
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-projects"] })}
                  fullWidth
                >
                  Refresh
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                  fullWidth
                >
                  New Project
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Assigned Users</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        Loading projects...
                      </TableCell>
                    </TableRow>
                  ) : filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        No projects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id} hover>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={600}>{project.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {project.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{project.client_name || "N/A"}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={project.status}
                              onChange={(e) => handleStatusChange(project.id, e.target.value)}
                              disabled={updateMutation.isLoading}
                            >
                              {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  <Chip
                                    label={option.label}
                                    size="small"
                                    sx={{
                                      bgcolor: statusColors[option.value],
                                      color: "white",
                                      "& .MuiChip-label": { fontSize: "0.75rem" }
                                    }}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.assigned_users && project.assigned_users.length > 0 ? (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {project.assigned_users.slice(0, 2).map((user, index) => (
                                <Chip
                                  key={index}
                                  label={user.name || user}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {project.assigned_users.length > 2 && (
                                <Chip
                                  label={`+${project.assigned_users.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          ) : (
                            "No users assigned"
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Create Project Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Create New Project
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(date) => setFormData({ ...formData, start_date: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.start_date,
                      helperText: errors.start_date,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={formData.end_date}
                  onChange={(date) => setFormData({ ...formData, end_date: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.end_date,
                      helperText: errors.end_date,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Client ID"
                  type="number"
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  helperText="Enter the client ID this project belongs to"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} disabled={createMutation.isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? "Creating..." : "Create Project"}
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
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
      </Box>
    </LocalizationProvider>
  );
};