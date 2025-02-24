// frontend/src/pages/TraderList.js
import React, { useEffect, useState } from 'react';
import { fetchTraders } from '../services/api';
import { Link } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TraderList = () => {
  const { t } = useTranslation();
  const [traderList, setTraderList] = useState([]);

  useEffect(() => {
    const loadTraders = async () => {
      try {
        const data = await fetchTraders();
        setTraderList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(t('error'), error);
      }
    };
    loadTraders();
  }, [t]);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        {t('traders')}
      </Typography>
      <Grid container spacing={4}>
        {traderList.map((trader) => {
          const totalVotes = trader.voteSummary ? trader.voteSummary.scammer + trader.voteSummary.legit : 0;
          const scammerPct = totalVotes > 0 ? Math.round((trader.voteSummary.scammer / totalVotes) * 100) : 0;
          const legitPct = totalVotes > 0 ? 100 - scammerPct : 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={trader._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 6, overflow: 'hidden' }}>
                {trader.images && trader.images.length > 0 && (
                  <CardMedia component="img" height="200" image={trader.images[0]} alt={trader.name} />
                )}
                <CardContent>
                  <Typography variant="h5" component={Link} to={`/trader/${trader._id}`} sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', mb: 1 }}>
                    {trader.name}
                  </Typography>
                  {trader.socialMedia && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('socialMedia', { socialMedia: trader.socialMedia })}
                    </Typography>
                  )}
                  {trader.voteSummary && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {`Scammer: ${scammerPct}% | Legit: ${legitPct}%`}
                      </Typography>
                      <Box sx={{ height: 10, width: '100%', borderRadius: 5, backgroundColor: '#e0e0e0', display: 'flex', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${scammerPct}%`, backgroundColor: '#f44336' }} />
                        <Box sx={{ height: '100%', width: `${legitPct}%`, backgroundColor: '#2196f3' }} />
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default TraderList;
