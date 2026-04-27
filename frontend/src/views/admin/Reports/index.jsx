import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { getStats } from "../../../services/dashboard/dashboard";
import { getRecentActivity } from "../../../services/activity/activity";

const formatCsv = (rows) => {
  const header = ["Date", "User", "Action", "Entity", "Entity ID"].join(",");
  const body = rows
    .map((row) => [row.createdAt, row.userName, row.action, row.entityType, row.entityId].map((value) => `"${String(value || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return `${header}\n${body}`;
};

export const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  });

  const { data: activityRows = [], isLoading: activityLoading, refetch } = useQuery({
    queryKey: ["reports-activity", startDate, endDate],
    queryFn: () => getRecentActivity({ startDate, endDate, limit: 100 }),
    keepPreviousData: true,
  });

  const handleExport = () => {
    const csv = formatCsv(activityRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `activity-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportMessage("Report exported successfully.");
    setTimeout(() => setExportMessage(""), 4000);
  };

  const summaryItems = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Users", value: summary.totalUsers },
      { label: "Clients", value: summary.totalClients },
      { label: "Projects", value: summary.totalProjects },
    ];
  }, [summary]);

  return (
    <Box sx={{ width: "100%", px: { xs: 1, md: 2 }, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Reports
            </Typography>
            <Typography color="text.secondary">
              View recent activity logs, filter by date, and export report data as CSV.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {summaryItems.map((item) => (
              <Grid item xs={12} sm={4} key={item.label}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {summaryLoading ? "..." : item.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <TextField
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
                <TextField
                  label="End date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
                <Button variant="contained" onClick={() => refetch()}>
                  Apply filter
                </Button>
                <Button variant="outlined" onClick={handleExport} disabled={!activityRows.length}>
                  Export CSV
                </Button>
              </Stack>
              {exportMessage && <Alert severity="success" sx={{ mb: 2 }}>{exportMessage}</Alert>}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Entity</TableCell>
                      <TableCell>Entity ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Loading activity...
                        </TableCell>
                      </TableRow>
                    ) : activityRows.length ? (
                      activityRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{row.userName}</TableCell>
                          <TableCell>{row.action}</TableCell>
                          <TableCell>{row.entityType}</TableCell>
                          <TableCell>{row.entityId}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No activity found for the selected date range.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};