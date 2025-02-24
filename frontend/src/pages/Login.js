// frontend/src/pages/Login.js
import React, { useEffect, useContext } from 'react';
import { Container, Card, CardContent, Typography, Button, Divider, SvgIcon } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

function GoogleIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M21.35 11.1H12v2.8h5.36c-.23 1.24-.92 2.3-1.96 3.01v2.5h3.18c1.86-1.72 2.93-4.26 2.93-7.31 0-.64-.06-1.26-.18-1.87z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.18-2.5c-.88.6-2.01.96-3.43.96-2.64 0-4.88-1.78-5.68-4.18H3.09v2.63A9.99 9.99 0 0012 22z" fill="#34A853" />
      <path d="M6.32 13.09a5.99 5.99 0 010-3.78V6.68H3.09a10.04 10.04 0 000 8.64l3.23-2.23z" fill="#FBBC05" />
      <path d="M12 5.48c1.47 0 2.8.51 3.84 1.51l2.88-2.88C16.95 2.13 14.69 1 12 1 7.34 1 3.32 3.45 1.09 6.68l3.23 2.53C5.12 6.27 8.36 5.48 12 5.48z" fill="#EA4335" />
      <path d="M1 1h22v22H1z" fill="none" />
    </SvgIcon>
  );
}

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const redirectUrl = params.get('redirect') || '/';
    if (tokenParam) {
      setToken(tokenParam);
      navigate(redirectUrl);
    }
  }, [location, navigate, setToken]);

  const handleGoogleSignIn = () => {
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect') || '/';
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={5} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" align="center" gutterBottom>
            {t('login')}
          </Typography>
          <Divider sx={{ my: 2 }}>or</Divider>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5 }}
          >
            {t('googleSignIn')}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
