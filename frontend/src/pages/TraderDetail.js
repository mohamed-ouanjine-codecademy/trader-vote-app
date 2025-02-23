// frontend/src/pages/TraderDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTraderById } from '../services/api';
import {
  Container,
  Typography,
  Divider,
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
  }, [id]);

  if (!traderData) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" align="center">
          {t('loading')}
        </Typography>
      </Container>
    );
  }

  const { trader, voteSummary } = traderData;
  const totalVotes = voteSummary ? voteSummary.scammer + voteSummary.legit : 0;
  const scammerPct = totalVotes > 0 ? Math.round((voteSummary.scammer / totalVotes) * 100) : 0;
  const legitPct = totalVotes > 0 ? 100 - scammerPct : 0;

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        {trader.name}
      </Typography>
      {trader.images && trader.images.length > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
          <Card sx={{ maxWidth: 700, borderRadius: 3, boxShadow: 6 }}>
            <CardMedia
              component="img"
              image={trader.images[0]}
              alt={trader.name}
              sx={{ height: { xs: 250, md: 400 } }}
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('votes')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {`Scammer: ${scammerPct}% | Legit: ${legitPct}%`}
        </Typography>
        <Box
          sx={{
            height: 10,
            width: '100%',
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${scammerPct}%`,
              backgroundColor: '#f44336',
            }}
          />
          <Box
            sx={{
              height: '100%',
              width: `${legitPct}%`,
              backgroundColor: '#2196f3',
            }}
          />
        </Box>
      </Box>
      <VoteForm traderId={trader._id} onVoteSubmitted={loadTrader} />
      <Divider sx={{ my: 3 }} />
      <CommentsSection traderId={trader._id} />
    </Container>
  );
};

export default TraderDetail;
