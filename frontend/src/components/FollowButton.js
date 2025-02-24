// frontend/src/components/FollowButton.js
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const FollowButton = ({ traderId }) => {
  const { t } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchFollowStatus = async () => {
    try {
      if (!token) {
        setIsFollowing(false);
        setLoading(false);
        return;
      }
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userFollowed = res.data.user.followedTraders.map(id => id.toString());
      setIsFollowing(userFollowed.includes(traderId));
    } catch (error) {
      console.error("Error fetching follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowStatus();
  }, [traderId, token]);

  const handleFollow = async () => {
    if (!token) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.href));
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/follow/${traderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following trader:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!token) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.href));
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/follow/${traderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing trader:", error);
    }
  };

  if (loading) return null; // Optionally display a spinner

  return (
    <>
      {isFollowing ? (
        <Button variant="outlined" color="secondary" onClick={handleUnfollow} fullWidth sx={{ mt: 2 }}>
          {t('unfollow', 'Unfollow')}
        </Button>
      ) : (
        <Button variant="contained" onClick={handleFollow} fullWidth sx={{ mt: 2 }}>
          {t('follow', 'Follow')}
        </Button>
      )}
    </>
  );
};

export default FollowButton;
