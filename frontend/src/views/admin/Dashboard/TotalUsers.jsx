
import { Card, CardContent, Grid, Typography } from "@mui/material";
export const TotalUsers = ({ total }) => {

    return (
        <Card sx={{ borderRadius: 3 }} >
            <CardContent >
                <Typography variant="subtitle2" color="text.secondary">
                    Total Users
                </Typography>

                <Typography variant="h4" fontWeight="bold">
                    {total}
                </Typography>
            </CardContent>
        </Card>
    )
}