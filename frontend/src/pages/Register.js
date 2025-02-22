import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/register', { username, password });
      navigate('/login');
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            {t('register')}
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
            <Button variant="contained" type="submit" fullWidth>
              {t('register')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
