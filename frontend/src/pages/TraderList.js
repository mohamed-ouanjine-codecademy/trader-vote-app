// frontend/src/pages/TraderList.js
import React, { useEffect, useState } from 'react';
import { fetchTraders } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Fade,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const TraderList = () => {
  const { t } = useTranslation();
  const [traderList, setTraderList] = useState([]);

  const loadTraders = async () => {
    try {
      const data = await fetchTraders();
      setTraderList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  useEffect(() => {
    loadTraders();
  }, [t]);

  return (
    <Fade in timeout={600}>
      <Container sx={{ py: 6, maxWidth: { xs: '95%', md: '90%' } }}>
        {/* Header Banner */}
        <Paper 
          elevation={6} 
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 3,
            backgroundImage: 'url(https://source.unsplash.com/1600x400/?market,stock)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            color: 'white',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 3,
            }}
          />
          <Typography variant="h3" sx={{ position: 'relative', fontWeight: 700, textAlign: 'center' }}>
            {t('traders')}
          </Typography>
          <Typography variant="subtitle1" sx={{ position: 'relative', textAlign: 'center', mt: 1 }}>
            {t('discoverTopTraders', 'Discover and evaluate traders based on community feedback.')}
          </Typography>
        </Paper>

        {/* Trader Cards */}
        <Grid container spacing={4}>
          {traderList.map((trader) => {
            const totalVotes =
              trader.voteSummary && trader.voteSummary.scammer + trader.voteSummary.legit;
            const scammerPct = totalVotes > 0 ? Math.round((trader.voteSummary.scammer / totalVotes) * 100) : 0;
            const legitPct = totalVotes > 0 ? 100 - scammerPct : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={trader._id}>
                <Fade in timeout={600}>
                  <Card 
                    sx={{
                      borderRadius: 3,
                      boxShadow: 6,
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 10 },
                    }}
                  >
                    {trader.images && trader.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={trader.images[0]}
                        alt={trader.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/trader/${trader._id}`}
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          fontWeight: 'bold',
                          mb: 1,
                          transition: 'color 0.3s',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {trader.name}
                      </Typography>
                      {trader.socialMedia && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {t('socialMedia', { socialMedia: trader.socialMedia })}
                        </Typography>
                      )}
                      {trader.voteSummary && (
                        <>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {`Scammer: ${scammerPct}% | Legit: ${legitPct}%`}
                          </Typography>
                          <Box
                            sx={{
                              height: 10,
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
                        </>
                      )}
                      <Divider sx={{ my: 2 }} />
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        component={Link} 
                        to={`/trader/${trader._id}`}
                        sx={{ textTransform: 'none' }}
                      >
                        {t('viewDetails', 'View Details')}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Fade>
  );
};

export default TraderList;
