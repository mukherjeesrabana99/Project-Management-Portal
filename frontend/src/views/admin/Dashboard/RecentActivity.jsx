import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import PersonIconImport from "@mui/icons-material/Person";
import BusinessIconImport from "@mui/icons-material/Business";
import FolderIconImport from "@mui/icons-material/Folder";
import moment from "moment";

const resolveIcon = (Icon) => (Icon && Icon.default ? Icon.default : Icon);
const PersonIcon = resolveIcon(PersonIconImport);
const BusinessIcon = resolveIcon(BusinessIconImport);
const FolderIcon = resolveIcon(FolderIconImport);

export const RecentActivity = ({ activities }) => {
    const getEntityIcon = (entityType) => {
        switch (entityType) {
            case 'user':
                return <PersonIcon />;
            case 'project':
                return <FolderIcon />;
            case 'client':
                return <BusinessIcon />;
            default:
                return <PersonIcon />;
        }
    };

    const getEntityColor = (entityType) => {
        switch (entityType) {
            case 'user':
                return '#3b82f6';
            case 'project':
                return '#22c55e';
            case 'client':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    };

    return (
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense>
                {activities.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No recent activities
                    </Typography>
                ) : (
                    activities.map((activity) => (
                        <ListItem key={activity.id} sx={{ px: 0 }}>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: getEntityColor(activity.entityType),
                                        width: 32,
                                        height: 32
                                    }}
                                >
                                    {getEntityIcon(activity.entityType)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" fontWeight="medium">
                                        {activity.action}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Chip
                                            label={activity.entityType}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                bgcolor: getEntityColor(activity.entityType),
                                                color: 'white'
                                            }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            by {activity.userName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {moment(activity.createdAt).fromNow()}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );
};