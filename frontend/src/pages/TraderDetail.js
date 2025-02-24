// frontend/src/pages/TraderDetail.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTraderById } from '../services/api';
import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  CardMedia,
  Fade,
  Button
} from '@mui/material';
import VoteForm from '../components/VoteForm';
import CommentsSection from '../components/CommentsSection';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';

const TraderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [traderData, setTraderData] = useState(null);
  const socketRef = useRef(null);

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

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socketRef.current = socket;
    socket.emit('joinRoom', id);
    socket.on('commentUpdate', (data) => {
      if (data.traderId === id) loadTrader();
    });
    socket.on('voteUpdate', (data) => {
      if (data.traderId === id) loadTrader();
    });
    return () => {
      socket.disconnect();
    };
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
    <Fade in timeout={600}>
      <Container sx={{ py: 6, maxWidth: { xs: '95%', md: '80%' } }}>
        {/* Hero Section */}
        <Paper
          elevation={8}
          sx={{
            position: 'relative',
            height: { xs: 250, md: 400 },
            borderRadius: 3,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          {trader.images && trader.images.length > 0 && (
            <CardMedia
              component="img"
              image={trader.images[0]}
              alt={trader.name}
              sx={{ height: '100%', width: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              px: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {trader.name}
            </Typography>
            {trader.socialMedia && (
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {t('socialMedia', { socialMedia: trader.socialMedia })}
              </Typography>
            )}
            <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
              {t('viewDetails', 'View Details')}
            </Button>
          </Box>
        </Paper>

        {/* Vote Summary Section */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('votes')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {`Scammer: ${scammerPct}% | Legit: ${legitPct}%`}
          </Typography>
          <Box
            sx={{
              height: 14,
              width: '100%',
              borderRadius: 5,
              backgroundColor: 'grey.300',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${scammerPct}%`,
                backgroundColor: 'error.main',
                transition: 'width 0.5s',
              }}
            />
            <Box
              sx={{
                height: '100%',
                width: `${legitPct}%`,
                backgroundColor: 'primary.main',
                transition: 'width 0.5s',
              }}
            />
          </Box>
        </Paper>

        {/* Vote Form Section */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <VoteForm traderId={trader._id} onVoteSubmitted={loadTrader} />
        </Paper>

        {/* Comments Section */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
          <CommentsSection traderId={trader._id} />
        </Paper>
      </Container>
    </Fade>
  );
};

export default TraderDetail;
