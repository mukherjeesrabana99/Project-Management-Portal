
import { Link, useNavigate } from 'react-router-dom';


import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, Stack, TextField, Typography, useMediaQuery } from '@mui/material';




import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthCardWrapper from './AuthCardWrapper';
import { useState } from 'react';
import { Box } from '@mui/system';
import { login } from '../../services/authentication/login';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;




const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    login(formData)
      .then((data) => {
        console.log("Login successful:", data);
        localStorage.setItem("accessToken", data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        localStorage.setItem("loggedRole", data.user.role);
        const role = data.user.role;
        if (role === "Admin") navigate("/admin/dashboard");
        else if (role === "Client") navigate("/client/dashboard");
        else navigate("/user/dashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error);

      });
  };


  return (
    <>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">

                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Hi, Welcome Back
                          </Typography>
                          <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                      />
                      <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                      />

                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </Box>
                  </Grid>


                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </>
  );
};

export default Login;



