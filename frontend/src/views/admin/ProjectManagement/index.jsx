import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Fab,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Edit, Add as AddIcon } from "@mui/icons-material";
import { getClientProjects, updateClientProjectStatus, createProject } from "../../../services/client/client";
import { getAllClients } from "../../../services/admin/client";
import { getAllUsers } from "../../../services/admin/user";


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

export const ProjectManagement = () => {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["client-projects"],
    queryFn: getClientProjects
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_id: "",
    start_date: "",
    end_date: "",
    status: "planned",
    assignments: []
  });



  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-projects"] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) =>
      updateClientProjectStatus(payload.projectId, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-projects"] });
      handleClose();
    },
  });

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      title: "",
      status: "planned",
      description: "",
      start_date: "",
      end_date: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description || "",
      client_id: project.client_id,
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      status: project.status,
      assignments: project.assigned_users?.map((u) => ({
        user_id: u.id
      })) || []
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };


  const handleSave = () => {
    if (isEditMode) {
      updateMutation.mutate({
        projectId: formData.id,
        status: formData.status,
      });
    } else {
      const payload = {
        title: formData.title,
        description: formData.description,
        client_id: formData.client_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        assignments: formData.assignments
      };
      createMutation.mutate(payload);
    }
  };

  const projectSummary = useMemo(() => {
    return projects.reduce(
      (acc, project) => {
        acc.total += 1;
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      { total: 0, planned: 0, active: 0, completed: 0, on_hold: 0 },
    );
  }, [projects]);

  return (
    <Box sx={{ width: "100%", px: 1, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Client Projects
          </Typography>
          <Typography color="text.secondary">
            View your assigned projects and update the current status for each item.
          </Typography>
          
        </Grid>

       

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Total Assigned Projects
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
                  {isLoading ? "..." : projectSummary.total}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Active
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: statusColors.active }}>
                  {projectSummary.active}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">
                  Completed
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: statusColors.completed }}>
                  {projectSummary.completed}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Status Overview
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {statusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={`${option.label}: ${projectSummary[option.value] || 0}`}
                    sx={{ bgcolor: statusColors[option.value], color: "#fff" }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assigned Projects
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Assigned Users</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} hover>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={project.status}
                            sx={{ bgcolor: statusColors[project.status] || "#64748b", color: "#fff" }}
                          />
                        </TableCell>
                        <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "TBD"}</TableCell>
                        <TableCell>{project.client_name}</TableCell>
                        <TableCell>{project.assigned_users?.length ? project.assigned_users.map((user) => user.name).join(", ") : "None"}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenEdit(project)}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
        <DialogTitle>
          {isEditMode ? "Update Project" : "Create Project"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Project Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Status"
              select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              multiline
              minRows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.client_id}
                label="Client"
                onChange={(e) =>
                  setFormData({ ...formData, client_id: e.target.value })
                }
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <FormControl fullWidth>
              <InputLabel>Assign Users</InputLabel>
              <Select
                multiple
                value={formData.assignments?.map((a) => a.user_id)}
                label="Assign Users"
                onChange={(e) => {
                  const selectedIds = e.target.value;

                  setFormData({
                    ...formData,
                    assignments: selectedIds.map((id) => ({
                      user_id: id
                    }))
                  });
                }}
                renderValue={(selected) =>
                  users
                    .filter((u) => selected.includes(u.id))
                    .map((u) => u.name)
                    .join(", ")
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {isEditMode
              ? updateMutation.isLoading
                ? "Updating..."
                : "Update"
              : createMutation.isLoading
                ? "Creating..."
                : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", md: "none" },
        }}
        onClick={() => handleOpenCreate()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};