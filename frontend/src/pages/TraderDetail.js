// frontend/src/pages/TraderDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTraderById } from '../services/api';
import { Container, Typography, Divider, Grid } from '@mui/material';
import VoteForm from '../components/VoteForm';
import CommentsSection from '../components/CommentsSection';
import { useTranslation } from 'react-i18next';

const TraderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [traderData, setTraderData] = useState(null);

  const loadTrader = async () => {
    try {
      const data = await fetchTraderById(id);
      setTraderData(data);
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  useEffect(() => {
    loadTrader();
  }, [id, t]);

  if (!traderData) {
    return <Container>{t('loading')}</Container>;
  }

  const { trader, votes } = traderData;
  const scamVotes = votes.filter(v => v.vote === 'scammer').length;
  const legitVotes = votes.filter(v => v.vote === 'legit').length;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {trader.name}
      </Typography>
      {trader.images && trader.images.length > 0 && (
        <img src={trader.images[0]} alt={trader.name} style={{ maxWidth: '100%', height: 'auto' }} />
      )}
      {trader.socialMedia && (
        <Typography variant="body1" gutterBottom>
          {t('socialMedia', { socialMedia: trader.socialMedia })}
        </Typography>
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">{t('votes')}</Typography>
      <Typography variant="body1">{t('scammerVotes', { count: scamVotes })}</Typography>
      <Typography variant="body1">{t('legitVotes', { count: legitVotes })}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        {t('submitVote')}
      </Typography>
      <VoteForm traderId={trader._id} onVoteSubmitted={loadTrader} />
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        {t('evidenceSubmitted')}
      </Typography>
      <Grid container spacing={2}>
        {votes.map((vote) =>
          vote.evidence.map((imgPath, index) => (
            <Grid item xs={6} sm={4} key={`${vote._id}-${index}`}>
              <img src={`http://localhost:5000/${imgPath}`} alt="Evidence" style={{ width: '100%', height: 'auto' }} />
            </Grid>
          ))
        )}
      </Grid>
      {/* New Comments Section */}
      <CommentsSection traderId={trader._id} />
    </Container>
  );
};

export default TraderDetail;
