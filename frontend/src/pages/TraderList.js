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
    <Container>
      <Typography variant="h4" gutterBottom>
        {t('traders')}
      </Typography>
      <Grid container spacing={2}>
        {traders.map((trader) => (
          <Grid item xs={12} sm={6} md={4} key={trader._id}>
            <Card>
              {trader.images && trader.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={trader.images[0]}
                  alt={trader.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">
                  <Link to={`/trader/${trader._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {trader.name}
                  </Link>
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
