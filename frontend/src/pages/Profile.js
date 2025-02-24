// frontend/src/pages/Profile.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Card, CardContent, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
      // Set the newName to the current display name, if available.
      setNewName(res.data.user.displayName || res.data.user.username || '');
    } catch (err) {
      console.error(t('error'), err);
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/profile/update`,
        { displayName: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData({ ...profileData, user: res.data.user });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" align="center" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          {t('loading')}
        </Typography>
      </Container>
    );
  }

  const { user, votes, comments } = profileData;

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('profile')}
      </Typography>
      
      {/* Update Name Section */}
      <Paper sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 6 }}>
        <Typography variant="h6">
          {t('currentName')}: {user.displayName || user.username}
        </Typography>
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
          <TextField 
            label={t('newName', 'New Name')}
            variant="outlined"
            fullWidth 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {t('updateProfile', 'Update Profile')}
          </Button>
        </Box>
      </Paper>
      
      {/* Votes Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('myVotes')}
        </Typography>
        {votes.length === 0 ? (
          <Typography variant="body1">{t('noVotes')}</Typography>
        ) : (
          <List>
            {votes.map(vote => (
              <ListItem key={vote._id}>
                <ListItemText 
                  primary={`${vote.trader.name}: ${vote.vote}`} 
                  secondary={new Date(vote.createdAt).toLocaleString()} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
      {/* Comments Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {t('myComments')}
        </Typography>
        {comments.length === 0 ? (
          <Typography variant="body1">{t('noComments')}</Typography>
        ) : (
          <List>
            {comments.map(comment => (
              <ListItem key={comment._id}>
                <ListItemText 
                  primary={`${comment.trader ? comment.trader.name : 'Unknown Trader'}: ${comment.text}`} 
                  secondary={new Date(comment.createdAt).toLocaleString()} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
