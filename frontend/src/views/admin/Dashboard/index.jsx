
import { Grid, Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../../services/dashboard/dashboard";
import { getActivityStats, getActivityTimeline, getActivityByUser, getRecentActivity } from "../../../services/activity/activity";
import { StatCard } from "./StatCard";
import { ActivityTimelineChart } from "./ActivityTimelineChart";
import { ActivityByUserChart } from "./ActivityByUserChart";
import { ActivityTypeChart } from "./ActivityTypeChart";
import { RecentActivity } from "./RecentActivity";

import PeopleIconImport from "@mui/icons-material/People";
import BusinessIconImport from "@mui/icons-material/Business";
import FolderIconImport from "@mui/icons-material/Folder";
import AssessmentIconImport from "@mui/icons-material/Assessment";

const resolveIcon = (Icon) => (Icon && Icon.default ? Icon.default : Icon);
const PeopleIcon = resolveIcon(PeopleIconImport);
const BusinessIcon = resolveIcon(BusinessIconImport);
const FolderIcon = resolveIcon(FolderIconImport);
const AssessmentIcon = resolveIcon(AssessmentIconImport);

export const Dashboard = () => {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getStats,
    });

    const { data: activityStats, isLoading: activityLoading } = useQuery({
        queryKey: ["activity-stats"],
        queryFn: getActivityStats,
    });

    const { data: timelineData, isLoading: timelineLoading } = useQuery({
        queryKey: ["activity-timeline"],
        queryFn: () => getActivityTimeline("week"),
    });

    const { data: userActivity, isLoading: userLoading } = useQuery({
        queryKey: ["activity-by-user"],
        queryFn: getActivityByUser,
    });

    const { data: recentActivity, isLoading: recentLoading } = useQuery({
        queryKey: ["recent-activity"],
        queryFn: () => getRecentActivity(5),
    });

    if (statsLoading || activityLoading) {
        return (
            <Grid container spacing={3}>
                {[...Array(8)].map((_, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ p: 2 }}>
                            <Skeleton variant="rectangular" height={100} />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    color="#3b82f6"
                    icon={<PeopleIcon />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Projects"
                    value={stats?.totalProjects || 0}
                    color="#22c55e"
                    icon={<FolderIcon />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Clients"
                    value={stats?.totalClients || 0}
                    color="#f59e0b"
                    icon={<BusinessIcon />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Activities"
                    value={activityStats?.totalActivities || 0}
                    color="#ef4444"
                    icon={<AssessmentIcon />}
                />
            </Grid>

            {/* Charts Row 1 */}
            <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Activity Timeline (Weekly)
                        </Typography>
                        {timelineLoading ? (
                            <Skeleton variant="rectangular" height={300} />
                        ) : (
                            <ActivityTimelineChart data={timelineData?.data || []} />
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Activity by User
                        </Typography>
                        {userLoading ? (
                            <Skeleton variant="rectangular" height={300} />
                        ) : (
                            <ActivityByUserChart data={userActivity || []} />
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Charts Row 2 */}
            <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Activity Types
                        </Typography>
                        {activityLoading ? (
                            <Skeleton variant="rectangular" height={300} />
                        ) : (
                            <ActivityTypeChart data={activityStats?.activitiesByType || []} />
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        {recentLoading ? (
                            <Skeleton variant="rectangular" height={300} />
                        ) : (
                            <RecentActivity activities={recentActivity || []} />
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

