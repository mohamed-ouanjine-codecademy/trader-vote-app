// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent, Divider } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a token was provided in the query parameters (after Google login)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to the backend Google auth endpoint
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            {t('login')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label={t('username')}
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('password')}
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit" fullWidth sx={{ mb: 2 }}>
              {t('login')}
            </Button>
          </Box>
          <Divider sx={{ my: 2 }}>or</Divider>
          <Button variant="outlined" fullWidth onClick={handleGoogleSignIn}>
            {t('googleSignIn')}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
