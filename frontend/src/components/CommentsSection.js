// frontend/src/components/CommentsSection.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CommentsSection = ({ traderId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');

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
  }, [traderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/traders/${traderId}/comments`,
        { text: commentText, name: commentName },
        token && { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      setCommentName('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('comments')}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label={t('nameOptional')}
          variant="outlined"
          fullWidth
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label={t('comment')}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button variant="contained" type="submit" fullWidth sx={{ py: 1.5 }}>
          {t('postComment')}
        </Button>
      </Box>
      <List sx={{ mt: 2 }}>
        {comments.map((comment) => (
          <Paper key={comment._id} elevation={2} sx={{ p: 2, mb: 1 }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={comment.name}
                secondary={
                  <>
                    {comment.text}
                    <Typography variant="caption" display="block">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default CommentsSection;
