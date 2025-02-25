// frontend/src/components/Navbar.js
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import Notifications from './Notifications';

const Navbar = ({ toggleMode, mode }) => {
  const { t, i18n } = useTranslation();
  const { token, setToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  // Define the nav links
  const navLinks = [
    { label: t('leaderboard', 'Leaderboard'), path: '/leaderboard' },
    ...(token ? [{ label: t('profile', 'Profile'), path: '/profile' }] : []),
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {t('traderVoteApp')}
      </Typography>
      <List>
        {navLinks.map((item) => (
          <ListItem button key={item.path} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {token ? (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary={t('logout', 'Logout')} />
          </ListItem>
        ) : (
          <ListItem button component={Link} to="/login">
            <ListItemText primary={t('login', 'Login')} />
          </ListItem>
        )}
        <ListItem>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {mode === 'dark' ? t('darkMode', 'Dark Mode') : t('lightMode', 'Light Mode')}
            </Typography>
            <Switch checked={mode === 'dark'} onChange={toggleMode} color="default" />
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #0D47A1, #1976D2)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Mobile: Hamburger Menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            {t('traderVoteApp')}
          </Typography>
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navLinks.map((item) => (
              <Button key={item.path} color="inherit" component={Link} to={item.path}>
                {item.label}
              </Button>
            ))}
            {token && <Notifications />}
            {token ? (
              <Button color="inherit" onClick={handleLogout}>
                {t('logout', 'Logout')}
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                {t('login', 'Login')}
              </Button>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {mode === 'dark' ? t('darkMode', 'Dark Mode') : t('lightMode', 'Light Mode')}
              </Typography>
              <Switch checked={mode === 'dark'} onChange={toggleMode} color="default" />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
