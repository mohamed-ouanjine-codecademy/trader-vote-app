// frontend/src/components/CommentItem.js
import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Collapse, TextField, Button, Avatar, Grow } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CommentItem = ({ comment, traderId, refreshComments, level = 0 }) => {
  const { t } = useTranslation();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');
  const token = localStorage.getItem('token');

  const handleVote = async (action) => {
    try {
      if (!token) {
        alert(t('pleaseLoginToVote') || 'Please log in to vote.');
        return;
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/comments/${comment._id}/vote`, { action }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshComments();
    } catch (error) {
      console.error('Error voting on comment:', error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/traders/${traderId}/comments`, {
        text: replyText,
        name: replyName,
        parentComment: comment._id,
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      setReplyText('');
      setReplyName('');
      setReplyOpen(false);
      refreshComments();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  // Calculate score based on the length of vote arrays (if present)
  const upvotes = comment.upvotedBy ? comment.upvotedBy.length : 0;
  const downvotes = comment.downvotedBy ? comment.downvotedBy.length : 0;
  const score = upvotes - downvotes;

  return (
    <Grow in timeout={600}>
      <Box sx={{ ml: level * 4, mt: 2, borderLeft: level > 0 ? '2px solid #ccc' : 'none', pl: level > 0 ? 2 : 0 }}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ mr: 1, bgcolor: 'primary.main', width: 32, height: 32 }}>
              {comment.name ? comment.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {comment.name}
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {comment.text}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => handleVote('up')} sx={{ '&:hover': { color: 'primary.main' } }}>
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 0.5 }}>
              {score}
            </Typography>
            <IconButton size="small" onClick={() => handleVote('down')} sx={{ '&:hover': { color: 'error.main' } }}>
              <ThumbDownIcon fontSize="small" />
            </IconButton>
            <Button size="small" startIcon={<ReplyIcon />} onClick={() => setReplyOpen(!replyOpen)} sx={{ ml: 2 }}>
              {t('reply')}
            </Button>
          </Box>
          <Collapse in={replyOpen} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleReplySubmit} sx={{ mt: 1, ml: 2 }}>
              <TextField
                label={t('nameOptional')}
                variant="outlined"
                fullWidth
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                sx={{ mb: 1 }}
              />
              <TextField
                label={t('reply')}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ mb: 1 }}
                required
              />
              <Button variant="contained" type="submit" size="small">
                {t('submitReply')}
              </Button>
            </Box>
          </Collapse>
        </Paper>
        {comment.replies && comment.replies.length > 0 &&
          comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} traderId={traderId} refreshComments={refreshComments} level={level + 1} />
          ))
        }
      </Box>
    </Grow>
  );
};

export default CommentItem;
