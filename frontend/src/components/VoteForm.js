// frontend/src/components/VoteForm.js
import React, { useState } from 'react';
import { Box, Button, RadioGroup, FormControlLabel, Radio, Typography, Paper } from '@mui/material';
import { submitVote } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const VoteForm = ({ traderId, onVoteSubmitted }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [vote, setVote] = useState('scammer');
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const handleFileChange = (e) => {
    setEvidenceFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert(t("pleaseLoginToVote") || "Please log in to vote.");
      navigate(`/login?redirect=${encodeURIComponent(window.location.href)}`);
      return;
    }
    const formData = new FormData();
    formData.append('vote', vote);
    for (let i = 0; i < evidenceFiles.length; i++) {
      formData.append('evidence', evidenceFiles[i]);
    }
    try {
      await submitVote(traderId, formData);
      onVoteSubmitted(); // refresh trader details
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  if (!token) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="error">
          {t("pleaseLoginToVote") || "Please log in to vote."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.href)}`)}
          sx={{ mt: 2 }}
        >
          {t("login")}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t("submitVote")}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <RadioGroup row value={vote} onChange={(e) => setVote(e.target.value)} sx={{ mb: 2 }}>
          <FormControlLabel value="scammer" control={<Radio />} label={t("scammer")} />
          <FormControlLabel value="legit" control={<Radio />} label={t("legit")} />
        </RadioGroup>
        <Box sx={{ mb: 2 }}>
          <input type="file" multiple onChange={handleFileChange} style={{ width: "100%" }} />
        </Box>
        <Button variant="contained" type="submit" fullWidth sx={{ py: 1.5 }}>
          {t("submitVote")}
        </Button>
      </Box>
    </Paper>
  );
};

export default VoteForm;
