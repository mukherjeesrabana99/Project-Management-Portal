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
    Avatar,
    CircularProgress,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../../services/admin/user";
import { getAllClients } from "../../../services/admin/client";

const roleColors = {
    Admin: "#ef4444",
    User: "#3b82f6",
    Client: "#10b981",
};

const roleOptions = [
    { label: "Admin", value: 1 },
    { label: "User", value: 3 },
    { label: "Client", value: 2 },
];

export const UserManagement = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role_id: 3,
        client_id: null,
    });
    const [errors, setErrors] = useState({});

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ["admin-users"],
        queryFn: getAllUsers,
    });

    const { data: clients = [], isLoading: isClientsLoading, isClientserror } = useQuery({
        queryKey: ["admin-clients"],
        queryFn: getAllClients,
    });

    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            handleClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            handleClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
    });

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = !roleFilter || user.role_id === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const handleOpen = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: "",
                role_id: user.role_id,
                client_id: user.client_id || null,
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                role_id: 3,
                client_id: null,
            });
        }
        setErrors({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            role_id: 3,   
            client_id: null,
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
        if (!editingUser && !formData.password.trim()) newErrors.password = "Password is required";
        if (editingUser && formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const userData = { ...formData };
        if (!userData.password) delete userData.password;

        if (editingUser) {
            updateMutation.mutate({ id: editingUser.id, data: userData });
        } else {
            createMutation.mutate(userData);
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteMutation.mutate(userId);
        }
    };

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Failed to load users. Please try again.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    User Management
                </Typography>
                <Typography color="text.secondary">
                    Manage users, assign roles, and control access permissions
                </Typography>
            </Box>


            <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search users..."
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
                                <InputLabel>Filter by Role</InputLabel>
                                <Select
                                    value={roleFilter}
                                    label="Filter by Role"
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <MenuItem value="">All Roles</MenuItem>
                                    {roleOptions.map((option) => (
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
                                onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-users"] })}
                                fullWidth
                            >
                                Refresh
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpen()}
                                fullWidth
                            >
                                Add User
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "grey.50" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>

                                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight={600}>{user.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ID: {user.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role_name}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: roleColors[user.role_name] || "#6b7280",
                                                        color: "white",
                                                        "& .MuiChip-label": { fontSize: "0.75rem", fontWeight: 600 }
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="Edit User">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleOpen(user)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete User">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(user.id)}
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


            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h5" fontWeight={600}>
                        {editingUser ? "Edit User" : "Create New User"}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ pt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
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
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={editingUser ? "New Password (leave empty to keep current)" : "Password"}
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={!!errors.password}
                                helperText={errors.password}
                                required={!editingUser}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={formData.role_id}
                                    label="Role"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            role_id: e.target.value,
                                            client_id: e.target.value === 2 ? "" : null
                                        })
                                    }
                                >
                                    {roleOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {formData.role_id === 2 && (
                                <FormControl fullWidth>
                                    <InputLabel>Select Client</InputLabel>

                                    <Select
                                        value={formData.client_id || ""}
                                        label="Select Client"
                                        onChange={(e) =>
                                            setFormData({ ...formData, client_id: e.target.value })
                                        }
                                    >
                                        {isClientsLoading ? (
                                            <MenuItem disabled>
                                                <CircularProgress size={20} />
                                            </MenuItem>
                                        ) : (
                                            clients.map((client) => (
                                                <MenuItem key={client.id} value={client.id}>
                                                    {client.company_name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            )}
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
                            ? (editingUser ? "Updating..." : "Creating...")
                            : (editingUser ? "Update User" : "Create User")
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