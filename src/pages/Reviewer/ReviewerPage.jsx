import React from 'react';
import {
  Box, Typography, Button, Paper, Grid, TextField, InputAdornment, IconButton,
  Card, CardContent, CardActions, Chip, CircularProgress, Container
} from '@mui/material';
import { Search, Clear, Description, RateReview, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useReviewerDashboard } from './reviewerDashboardLogic';

const ReviewerPage = ({ adminView = false }) => {
  const navigate = useNavigate();
  const {
    loading,
    searchTerm,
    allListings,
    searchResults,
    handleInputChange,
    handleClear,
    handleApprove,
    handleReject
  } = useReviewerDashboard();

  const displayListings = searchTerm ? searchResults : allListings;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: adminView ? 'auto' : '100vh',
      bgcolor: adminView ? 'transparent' : '#f8f9fa',
      p: adminView ? 0 : 3
    }}>
      <Container maxWidth="lg" disableGutters={adminView}>
        {/* Header Section */}
        {!adminView && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ color: '#555' }}
            >
              Home
            </Button>
            <Typography variant="h4" fontWeight="bold" color="#132238">
              Reviewer Portal
            </Typography>
            <Box width={80} /> {/* Spacer */}
          </Box>
        )}

        {/* Dashboard Content */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4, boxShadow: adminView ? 'none' : '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: { xs: 2, md: 0 } }}>
              Pending Listings (Require Vetting)
            </Typography>

            <TextField
              placeholder="Search by title..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleInputChange}
              sx={{ width: { xs: '100%', md: 400 }, bgcolor: '#fff' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClear}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {displayListings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: '#888' }}>
              <Description sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
              <Typography>
                {searchTerm ? "No listings found matching your search." : "No pending listings waiting for review."}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {displayListings.map((listing) => (
                <Grid item xs={12} md={6} lg={4} key={listing.id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: '0.3s',
                    border: '1px solid #eee',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Chip
                          label={listing.category || 'Research'}
                          size="small"
                          sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ lineHeight: 1.3 }}>
                        {listing.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2
                      }}>
                        {listing.summary}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'orange', fontWeight: 'bold' }}>
                        Status: Pending
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(listing.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<RateReview />}
                        onClick={() => handleApprove(listing.id)}
                        sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
                      >
                        Approve
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ReviewerPage;