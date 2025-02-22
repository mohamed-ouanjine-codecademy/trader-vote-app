import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          {t('traderVoteApp')}
        </Typography>
        {token ? (
          <Button color="inherit" onClick={handleLogout}>
            {t('logout')}
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              {t('login')}
            </Button>
            <Button color="inherit" component={Link} to="/register">
              {t('register')}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
