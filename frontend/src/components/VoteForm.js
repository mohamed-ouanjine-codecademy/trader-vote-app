// frontend/src/components/VoteForm.js
import React, { useState } from 'react';
import { submitVote } from '../services/api';
import { Button, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const VoteForm = ({ traderId, onVoteSubmitted }) => {
  const { t } = useTranslation();
  const [vote, setVote] = useState('scammer');
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const handleFileChange = (e) => {
    setEvidenceFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('vote', vote);
    for (let i = 0; i < evidenceFiles.length; i++) {
      formData.append('evidence', evidenceFiles[i]);
    }
    try {
      await submitVote(traderId, formData);
      onVoteSubmitted(); // Refresh trader details
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <RadioGroup row value={vote} onChange={(e) => setVote(e.target.value)}>
        <FormControlLabel value="scammer" control={<Radio />} label={t('scammer')} />
        <FormControlLabel value="legit" control={<Radio />} label={t('legit')} />
      </RadioGroup>
      <Box sx={{ mt: 2 }}>
        <input type="file" multiple onChange={handleFileChange} />
      </Box>
      <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
        {t('submitVote')}
      </Button>
    </Box>
  );
};

export default VoteForm;
