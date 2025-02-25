// frontend/src/components/VoteForm.js
import React, { useState } from 'react';
import { Box, Button, RadioGroup, FormControlLabel, Radio, Typography, Paper, Tooltip } from '@mui/material';
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
      onVoteSubmitted(); // Refresh trader details after vote submission
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
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t("evidenceLabel", "Evidence (Optional)")}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            {t("evidenceHelp", "Attach images or screenshots to support your vote.")}
          </Typography>
          <Tooltip title={t("evidenceTooltip", "You can upload multiple files as evidence")} arrow>
            <Button variant="outlined" component="label">
              {t("uploadEvidence", "Upload Evidence")}
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
          </Tooltip>
          {evidenceFiles.length > 0 && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {t("filesSelected", "{{count}} file(s) selected", { count: evidenceFiles.length })}
            </Typography>
          )}
        </Box>
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
          {t("submitVote")}
        </Button>
      </Box>
    </Paper>
  );
};

export default VoteForm;
