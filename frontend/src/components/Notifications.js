// frontend/src/components/Notifications.js
import React, { useState, useEffect, useContext } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';

const Notifications = () => {
  const { t } = useTranslation();
  const { token, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchNotifications();
      const socket = io(process.env.REACT_APP_API_URL);
      // Join the room with the user's ID
      socket.emit('joinUserRoom', user._id);
      socket.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [token, user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">{t('noNotifications', 'No notifications')}</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification._id} onClick={handleClose}>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.createdAt).toLocaleString()}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default Notifications;
