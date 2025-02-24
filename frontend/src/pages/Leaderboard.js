// frontend/src/pages/Leaderboard.js
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();
  const [traders, setTraders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('scammerPct'); // Default sort

  const loadTraders = async () => {
    try {
      const data = await fetchTraders();
      if (Array.isArray(data)) {
        setTraders(data);
      } else {
        console.error("Expected an array but got:", data);
        setTraders([]);
      }
    } catch (error) {
      console.error(t('error'), error);
    }
  };

  useEffect(() => {
    loadTraders();
  }, []);

  // Filter traders by search term (case-insensitive)
  const filteredTraders = traders.filter((trader) =>
    trader.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute derived vote data for each trader
  const tradersWithData = filteredTraders.map((trader) => {
    const totalVotes =
      trader.voteSummary && trader.voteSummary.scammer + trader.voteSummary.legit;
    const scammerPct = totalVotes > 0 ? Math.round((trader.voteSummary.scammer / totalVotes) * 100) : 0;
    const legitPct = totalVotes > 0 ? 100 - scammerPct : 0;
    return { ...trader, scammerPct, legitPct, totalVotes };
  });

  // Sort traders based on the selected sort option
  const sortedTraders = tradersWithData.sort((a, b) => {
    if (sortOption === 'scammerPct') {
      return b.scammerPct - a.scammerPct;
    } else if (sortOption === 'legitPct') {
      return b.legitPct - a.legitPct;
    } else if (sortOption === 'totalVotes') {
      return b.totalVotes - a.totalVotes;
    }
    return 0;
  });

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        {t('leaderboard')}
      </Typography>

      {/* Search and Sorting Controls */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <TextField
          label={t('searchTraders')}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>{t('sortBy')}</InputLabel>
          <Select
            label={t('sortBy')}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="scammerPct">{t('sortScammer')}</MenuItem>
            <MenuItem value="legitPct">{t('sortLegit')}</MenuItem>
            <MenuItem value="totalVotes">{t('sortTotal')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {sortedTraders.slice(0, 10).map((trader, index) => (
          <Grid item xs={12} sm={6} md={4} key={trader._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 6, overflow: 'hidden' }}>
              {trader.images && trader.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={trader.images[0]}
                  alt={trader.name}
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
                  }}
                >
                  {`${index + 1}. ${trader.name}`}
                </Typography>
                {trader.socialMedia && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('socialMedia', { socialMedia: trader.socialMedia })}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {`Scammer: ${trader.scammerPct}% | Legit: ${trader.legitPct}%`}
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
                      width: `${trader.scammerPct}%`,
                      backgroundColor: '#f44336',
                    }}
                  />
                  <Box
                    sx={{
                      height: '100%',
                      width: `${trader.legitPct}%`,
                      backgroundColor: '#2196f3',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                  {t('viewDetails')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Leaderboard;
