// frontend/src/pages/TraderList.js
import React, { useEffect, useState } from 'react';
import { fetchTraders } from '../services/api';
import { Link } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TraderList = () => {
  const { t } = useTranslation();
  const [traders, setTraders] = useState([]);

  useEffect(() => {
    const getTraders = async () => {
      try {
        const data = await fetchTraders();
        setTraders(data);
      } catch (error) {
        console.error(t('error'), error);
      }
    };
    getTraders();
  }, [t]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t('traders')}
      </Typography>
      <Grid container spacing={3}>
        {traders.map((trader) => (
          <Grid item xs={12} sm={6} md={4} key={trader._id}>
            <Card
              sx={{
                maxWidth: 345,
                margin: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              {trader.images && trader.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={trader.images[0]}
                  alt={trader.name}
                />
              )}
              <CardContent>
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/trader/${trader._id}`}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {trader.name}
                </Typography>
                {trader.socialMedia && (
                  <Typography variant="body2" color="textSecondary">
                    {t('socialMedia', { socialMedia: trader.socialMedia })}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TraderList;
