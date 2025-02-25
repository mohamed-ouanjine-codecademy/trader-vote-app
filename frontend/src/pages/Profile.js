// frontend/src/pages/Profile.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Fade,
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
      setNewName(res.data.user.displayName || res.data.user.username || '');
      setLoading(false);
    } catch (error) {
      console.error(t('error'), error);
      setLoading(false);
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
      alert(t('profileUpdated', 'Profile updated successfully!'));
    } catch (error) {
      console.error(error);
      alert(t('profileUpdateError', 'Error updating profile.'));
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" align="center">
          {t('loading')}
        </Typography>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" align="center" color="error">
          {t('profileError', 'Error loading profile')}
        </Typography>
      </Container>
    );
  }

  const { user, votes, comments } = profileData;

  return (
    <Fade in timeout={600}>
      <Container sx={{ py: 6, maxWidth: { xs: '95%', md: '80%' } }}>
        {/* Profile Header */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'secondary.main',
                  fontSize: 32,
                }}
              >
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.username
                  ? user.username.charAt(0).toUpperCase()
                  : 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {user.displayName || user.username}
              </Typography>
              <Typography variant="subtitle1">
                {t('welcome', 'Welcome to your profile')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Profile Update Section */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('updateProfile', 'Update Profile')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleUpdate}
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label={t('newName', 'New Name')}
              variant="outlined"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Button type="submit" variant="contained">
              {t('saveChanges', 'Save Changes')}
            </Button>
          </Box>
        </Paper>

        {/* Recent Activity Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                {t('myVotes', 'My Votes')}
              </Typography>
              {votes.length === 0 ? (
                <Typography variant="body1">
                  {t('noVotes', "You haven't voted on any trader yet.")}
                </Typography>
              ) : (
                <List>
                  {votes.map((vote) => (
                    <ListItem key={vote._id}>
                      <ListItemText
                        primary={`${vote.trader.name}: ${vote.vote}`}
                        secondary={new Date(vote.createdAt).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                {t('myComments', 'My Comments')}
              </Typography>
              {comments.length === 0 ? (
                <Typography variant="body1">
                  {t('noComments', "You haven't posted any comments yet.")}
                </Typography>
              ) : (
                <List>
                  {comments.map((comment) => (
                    <ListItem key={comment._id}>
                      <ListItemText
                        primary={`${comment.trader ? comment.trader.name : 'Unknown Trader'}: ${comment.text}`}
                        secondary={new Date(comment.createdAt).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};

export default Profile;
