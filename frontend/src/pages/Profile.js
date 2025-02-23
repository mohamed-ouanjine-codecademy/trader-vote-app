// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
    } catch (err) {
      console.error(t('error'), err);
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h6">
            {t('username')}: {user.username || user.displayName || 'Google User'}
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>{t('myVotes')}</Typography>
        {votes.length === 0 ? (
          <Typography variant="body1">{t('noVotes')}</Typography>
        ) : (
          <List>
            {votes.map(vote => (
              <ListItem key={vote._id}>
                <ListItemText primary={`${vote.trader.name}: ${vote.vote}`} secondary={new Date(vote.createdAt).toLocaleString()} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>{t('myComments')}</Typography>
        {comments.length === 0 ? (
          <Typography variant="body1">{t('noComments')}</Typography>
        ) : (
          <List>
            {comments.map(comment => (
              <ListItem key={comment._id}>
                <ListItemText primary={`${comment.trader ? comment.trader.name : 'Unknown Trader'}: ${comment.text}`} secondary={new Date(comment.createdAt).toLocaleString()} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
