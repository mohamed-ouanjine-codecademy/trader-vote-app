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
  Collapse,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';

const CommentsSection = ({ traderId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentName, setNewCommentName] = useState('');
  const [replyForms, setReplyForms] = useState({}); // Track which comment IDs have an open reply form
  const [replyTexts, setReplyTexts] = useState({});
  const [replyNames, setReplyNames] = useState({});

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
      if (data.traderId === traderId) {
        fetchComments();
      }
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

  const handleReplySubmit = async (parentId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/traders/${traderId}/comments`,
        {
          text: replyTexts[parentId],
          name: replyNames[parentId],
          parentComment: parentId,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setReplyTexts({ ...replyTexts, [parentId]: '' });
      setReplyNames({ ...replyNames, [parentId]: '' });
      setReplyForms({ ...replyForms, [parentId]: false });
      fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const toggleReplyForm = (commentId) => {
    setReplyForms((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => (
      <Box key={comment._id} sx={{ ml: level * 3, mt: 2 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
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
          {level === 0 && (
            <Button size="small" onClick={() => toggleReplyForm(comment._id)}>
              {t('reply', 'Reply')}
            </Button>
          )}
        </Paper>
        {level === 0 && (
          <Collapse in={replyForms[comment._id]} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={(e) => handleReplySubmit(comment._id, e)} sx={{ mt: 1, ml: 2 }}>
              <TextField
                label={t('nameOptional')}
                variant="outlined"
                fullWidth
                value={replyNames[comment._id] || ''}
                onChange={(e) =>
                  setReplyNames({ ...replyNames, [comment._id]: e.target.value })
                }
                sx={{ mb: 1 }}
              />
              <TextField
                label={t('reply')}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={replyTexts[comment._id] || ''}
                onChange={(e) =>
                  setReplyTexts({ ...replyTexts, [comment._id]: e.target.value })
                }
                sx={{ mb: 1 }}
                required
              />
              <Button variant="contained" type="submit" size="small">
                {t('submitReply', 'Submit Reply')}
              </Button>
            </Box>
          </Collapse>
        )}
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </Box>
    ));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
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
      <List>{renderComments(comments)}</List>
    </Paper>
  );
};

export default CommentsSection;
