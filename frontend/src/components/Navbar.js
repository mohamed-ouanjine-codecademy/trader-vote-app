// frontend/src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Switch } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleMode, mode }) => {
  const { t, i18n } = useTranslation();
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [langAnchor, setLangAnchor] = useState(null);

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  const handleLangMenu = (event) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLangChange = (lng) => {
    i18n.changeLanguage(lng);
    setLangAnchor(null);
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #0D47A1, #1976D2)' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          {t('traderVoteApp')}
        </Typography>
        <Button color="inherit" component={Link} to="/leaderboard">
          {t('leaderboard')}
        </Button>
        <Switch checked={mode === 'dark'} onChange={toggleMode} color="default" />
        <IconButton color="inherit" onClick={handleLangMenu}>
          <Typography variant="body2">{i18n.language.toUpperCase()}</Typography>
        </IconButton>
        <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}>
          <MenuItem onClick={() => handleLangChange('en')}>EN</MenuItem>
          <MenuItem onClick={() => handleLangChange('fr')}>FR</MenuItem>
          <MenuItem onClick={() => handleLangChange('ar')}>AR</MenuItem>
        </Menu>
        {token ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              {t('profile')}
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              {t('logout')}
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            {t('login')}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
