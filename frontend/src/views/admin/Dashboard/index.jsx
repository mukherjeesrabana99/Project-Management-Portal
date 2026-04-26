
import { Grid } from "@mui/material";
import { TotalUsers } from "./TotalUsers";
import { StatCard } from "./StatCard";

import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import { SalesChart } from "./SalesChart";
import { SubscriptionChart } from "./SubscriptionChart";

export const Dashboard = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>

                <StatCard title="Clients"
                    value="120"
                    color="#22c55e"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>

                <StatCard title="Projects"
                    value="75"
                    color="#3b82f6"

                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Users"
                    value="850"
                    color="#3b82f6"

                />
            </Grid>
           
            <Grid item xs={12} sm={6} md={3}>

                <SalesChart />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>

                <SubscriptionChart />
            </Grid>
        </Grid>
    );
};

