// frontend/src/pages/TraderDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTraderById } from '../services/api';
import {
  Container,
  Typography,
  Divider,
  Grid,
  Box,
  Card,
  CardMedia,
} from '@mui/material';
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
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          {t('loading')}
        </Typography>
      </Container>
    );
  }

  const { trader, votes } = traderData;
  const scamVotes = votes.filter((v) => v.vote === 'scammer').length;
  const legitVotes = votes.filter((v) => v.vote === 'legit').length;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {trader.name}
      </Typography>
      {trader.images && trader.images.length > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
          <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardMedia
              component="img"
              image={trader.images[0]}
              alt={trader.name}
            />
          </Card>
        </Box>
      )}
      {trader.socialMedia && (
        <Typography variant="body1" align="center" gutterBottom>
          {t('socialMedia', { socialMedia: trader.socialMedia })}
        </Typography>
      )}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        {t('votes')}
      </Typography>
      <Typography variant="body1">
        {t('scammerVotes', { count: scamVotes })}
      </Typography>
      <Typography variant="body1">
        {t('legitVotes', { count: legitVotes })}
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        {t('submitVote')}
      </Typography>
      <VoteForm traderId={trader._id} onVoteSubmitted={loadTrader} />
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        {t('evidenceSubmitted')}
      </Typography>
      <Grid container spacing={2}>
        {votes.map((vote) =>
          vote.evidence.map((imgPath, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${vote._id}-${index}`}>
              <img
                src={`${process.env.REACT_APP_API_URL}/${imgPath}`}
                alt="Evidence"
                style={{ width: '100%', borderRadius: '4px' }}
              />
            </Grid>
          ))
        )}
      </Grid>
      <Divider sx={{ my: 3 }} />
      <CommentsSection traderId={trader._id} />
    </Container>
  );
};

export default TraderDetail;
