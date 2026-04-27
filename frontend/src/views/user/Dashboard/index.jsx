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
import { getUserProfile } from "../../../services/authentication/profile";
import { getAssignedUserProjects } from "../../../services/client/client";
import PersonOutlineIconImport from '@mui/icons-material/PersonOutline';
import TaskAltIconImport from '@mui/icons-material/TaskAlt';
import CheckCircleIconImport from '@mui/icons-material/CheckCircle';
import WarningAmberIconImport from '@mui/icons-material/WarningAmber';

const resolveIcon = (Icon) => (Icon && Icon.default ? Icon.default : Icon);
const PersonOutlineIcon = resolveIcon(PersonOutlineIconImport);
const TaskAltIcon = resolveIcon(TaskAltIconImport);
const CheckCircleIcon = resolveIcon(CheckCircleIconImport);
const WarningAmberIcon = resolveIcon(WarningAmberIconImport);

const statusColors = {
  planned: "#6366f1",
  active: "#22c55e",
  completed: "#10b981",
  on_hold: "#f59e0b",
};

export const Dashboard = () => {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["assigned-projects"],
    queryFn: getAssignedUserProjects,
  });

  const totals = useMemo(() => {
    const result = {
      total: 0,
      active: 0,
      completed: 0,
      on_hold: 0,
      planned: 0,
      overdue: 0,
    };
    const today = new Date();

    projects.forEach((project) => {
      result.total += 1;
      result[project.status] = (result[project.status] || 0) + 1;
      if (project.end_date && new Date(project.end_date) < today && project.status !== "completed") {
        result.overdue += 1;
      }
    });

    return result;
  }, [projects]);

  const upcomingProjects = useMemo(
    () => projects
      .filter((project) => project.end_date)
      .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
      .slice(0, 4),
    [projects],
  );

  const userName = profile?.name || "User";
  const role = localStorage.getItem("loggedRole") || "User";

  return (
    <Box sx={{ width: "100%", px: { xs: 1, md: 2 }, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome back, {userName}
            </Typography>
            <Typography color="text.secondary">
                Your user dashboard shows a quick summary of your assigned projects, upcoming deadlines, and profile information.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, minHeight: 225 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <PersonOutlineIcon sx={{ fontSize: 32, color: "primary.main" }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profile
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {userName}
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Role: {role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {profile?.email || (profileLoading ? "Loading..." : "Not available")}
                </Typography>
              </Stack>
              <Button
                component={Link}
                to="/user/profile"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Total Projects
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {projectsLoading ? "..." : totals.total}
              </Typography>
              <Chip label="Overview" size="small" sx={{ mt: 2, bgcolor: "#eef2ff", color: "#4338ca" }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Active Projects
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: statusColors.active }}>
                {projectsLoading ? "..." : totals.active}
              </Typography>
              <TaskAltIcon sx={{ mt: 2, color: statusColors.active }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Completed
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: statusColors.completed }}>
                {projectsLoading ? "..." : totals.completed}
              </Typography>
              <CheckCircleIcon sx={{ mt: 2, color: statusColors.completed }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, minHeight: 145, boxShadow: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Overdue
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#ef4444" }}>
                {projectsLoading ? "..." : totals.overdue}
              </Typography>
              <WarningAmberIcon sx={{ mt: 2, color: "#ef4444" }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
                <Typography variant="h6">Upcoming Deadlines</Typography>
                <Button component={Link} to="/user/profile" variant="outlined" size="small">
                  Update account
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                {projectsLoading ? (
                  <Typography>Loading upcoming deadlines...</Typography>
                ) : upcomingProjects.length === 0 ? (
                  <Typography color="text.secondary">No upcoming deadlines yet.</Typography>
                ) : (
                  upcomingProjects.map((project) => (
                    <Card key={project.id} sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {project.title || "Untitled project"}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                          Due {project.end_date ? new Date(project.end_date).toLocaleDateString() : "TBD"}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Status: <strong>{project.status || "N/A"}</strong>
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project snapshot
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                A quick view of your current assignments and the most recent change requests.
              </Typography>
              <Stack spacing={2}>
                {projectsLoading ? (
                  <Typography>Loading project information...</Typography>
                ) : projects.slice(0, 4).map((project) => (
                  <Box key={project.id} sx={{ p: 2, borderRadius: 2, background: "#f8fafc" }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {project.title || "Untitled project"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {project.description || "No description available."}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                      <Chip label={`Status: ${project.status || "n/a"}`} size="small" sx={{ bgcolor: `${statusColors[project.status] || "#cbd5e1"}`, color: "#fff" }} />
                      <Chip label={`Due: ${project.end_date ? new Date(project.end_date).toLocaleDateString() : "TBD"}`} size="small" />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};