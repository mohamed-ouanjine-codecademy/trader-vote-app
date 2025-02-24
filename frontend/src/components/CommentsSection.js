import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, List } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import CommentItem from './CommentItem';

const CommentsSection = ({ traderId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentName, setNewCommentName] = useState('');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/traders/${traderId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    const socket = io(process.env.REACT_APP_API_URL);
    socket.emit('joinRoom', traderId);
    socket.on('commentUpdate', (data) => {
      if (data.traderId === traderId) fetchComments();
    });
    return () => {
      socket.disconnect();
    };
  }, [traderId]);

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/traders/${traderId}/comments`,
        { text: newCommentText, name: newCommentName },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setNewCommentText('');
      setNewCommentName('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        {t('comments')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box component="form" onSubmit={handleNewCommentSubmit} sx={{ mb: 3 }}>
        <TextField
          label={t('nameOptional')}
          variant="outlined"
          fullWidth
          value={newCommentName}
          onChange={(e) => setNewCommentName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label={t('comment')}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button variant="contained" type="submit" fullWidth sx={{ py: 1.5 }}>
          {t('postComment')}
        </Button>
      </Box>
      <List>
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            traderId={traderId}
            refreshComments={fetchComments}
          />
        ))}
      </List>
    </Paper>
  );
};

export default CommentsSection;
