import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { getClientProjects } from "../../../services/client/client";
import FolderOpenIconImport from "@mui/icons-material/FolderOpen";
import PendingActionsIcoImport from "@mui/icons-material/PendingActions";
import CheckCircleIconImport from "@mui/icons-material/CheckCircle";
import WarningAmberIconImport from "@mui/icons-material/WarningAmber";

const statusColors = {
  planned: "#6366f1",
  active: "#22c55e",
  completed: "#10b981",
  on_hold: "#f59e0b",
};

const resolveIcon = (Icon) => (Icon && Icon.default ? Icon.default : Icon);
const FolderIcon = resolveIcon(FolderOpenIconImport);
const PendingActionsIcon = resolveIcon(PendingActionsIcoImport);
const CheckCircleIcon = resolveIcon(CheckCircleIconImport);
const WarningAmberIcon = resolveIcon(WarningAmberIconImport);

export const Dashboard = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["client-projects"],
    queryFn: getClientProjects
  });

  const summary = useMemo(() => {
    const totals = {
      total: 0,
      active: 0,
      completed: 0,
      on_hold: 0,
      planned: 0,
      overdue: 0,
    };

    const today = new Date();

    projects.forEach((project) => {
      totals.total += 1;
      totals[project.status] = (totals[project.status] || 0) + 1;
      if (project.end_date && new Date(project.end_date) < today && project.status !== "completed") {
        totals.overdue += 1;
      }
    });

    return totals;
  }, [projects]);

  const statusData = useMemo(
    () => [
      { name: "Active", value: summary.active, color: statusColors.active },
      { name: "Planned", value: summary.planned, color: statusColors.planned },
      { name: "Completed", value: summary.completed, color: statusColors.completed },
      { name: "On Hold", value: summary.on_hold, color: statusColors.on_hold },
    ].filter((item) => item.value > 0),
    [summary],
  );

  const timelineData = useMemo(() => {
    const grouped = {};
    projects.forEach((project) => {
      if (!project.end_date) return;
      const date = new Date(project.end_date);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  }, [projects]);

  const upcoming = useMemo(
    () => projects
      .filter((project) => project.end_date)
      .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
      .slice(0, 4),
    [projects],
  );

  return (
    <Box sx={{ width: "100%", px: 1, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Client Dashboard
            </Typography>
            <Typography color="text.secondary">
              Personal summary of your assigned projects, progress, and upcoming deadlines.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Total Projects
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {isLoading ? "..." : summary.total}
              </Typography>
              <Chip label="Overview" size="small" sx={{ mt: 2, bgcolor: "#eef2ff", color: "#4338ca" }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Active Projects
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: statusColors.active }}>
                {isLoading ? "..." : summary.active}
              </Typography>
              <PendingActionsIcon sx={{ mt: 2, color: statusColors.active }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Completed Projects
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: statusColors.completed }}>
                {isLoading ? "..." : summary.completed}
              </Typography>
              <CheckCircleIcon sx={{ mt: 2, color: statusColors.completed }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Overdue Projects
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#ef4444" }}>
                {isLoading ? "..." : summary.overdue}
              </Typography>
              <WarningAmberIcon sx={{ mt: 2, color: "#ef4444" }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Status Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} projects`, `Projects`]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deadlines
              </Typography>
              <Stack spacing={2}>
                {isLoading ? (
                  <Typography>Loading deadlines...</Typography>
                ) : upcoming.length === 0 ? (
                  <Typography color="text.secondary">No upcoming deadlines.</Typography>
                ) : (
                  upcoming.map((project) => (
                    <Box key={project.id} sx={{ p: 2, borderRadius: 2, background: "#f8fafc" }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Due {new Date(project.end_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Status: <strong>{project.status}</strong>
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Project Overview</Typography>
                <Button component={Link} to="/client/projects" variant="contained" color="secondary">
                  Manage Projects
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {isLoading ? (
                <Typography>Loading project overview...</Typography>
              ) : (
                <Stack spacing={2}>
                  {projects.slice(0, 4).map((project) => (
                    <Box key={project.id} sx={{ p: 2, borderRadius: 2, border: "1px solid #e5e7eb" }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {project.description || "No description available."}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                        <Chip label={`Status: ${project.status}`} size="small" sx={{ bgcolor: `${statusColors[project.status] || "#cbd5e1"}`, color: "#fff" }} />
                        <Chip label={`Client: ${project.client_name}`} size="small" />
                        <Chip label={`Due: ${project.end_date ? new Date(project.end_date).toLocaleDateString() : "TBD"}`} size="small" />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, minHeight: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {isLoading ? (
                <Typography>Loading notifications...</Typography>
              ) : (
                <Stack spacing={2}>
                  {projects.slice(0, 3).map((project) => (
                    <Box key={project.id} sx={{ p: 2, borderRadius: 2, background: "#ffffff" }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {project.status === "completed" ? "Project completed" : project.status === "active" ? "Project in progress" : "Status update"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.title} {project.end_date ? `due ${new Date(project.end_date).toLocaleDateString()}` : "with no deadline"}.
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};