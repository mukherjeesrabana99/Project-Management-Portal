import { Button } from "@mui/material";

export const Unauthorized = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <Button variant="contained" color="primary" href="/login">
                Go to Login
            </Button>
        </div>
    );
}
