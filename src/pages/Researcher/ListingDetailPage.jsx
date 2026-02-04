import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ListingDetailPage.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Typography, Button, IconButton, CircularProgress, Chip, Paper, Grid, Divider } from '@mui/material';
import authService from '../../services/authService';
import listingService from '../../services/listingService';
import friendService from '../../services/friendService'; // Added
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Added
import CheckIcon from '@mui/icons-material/Check'; // Added
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Added
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendStatus, setFriendStatus] = useState('none'); // none, sent, received, accepted
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const fetchListing = async () => {
      try {
        const response = await listingService.getListingById(id);
        const listingData = response.listing;
        setListing(listingData);

        // Check friend status if not own listing
        if (user && listingData.researcher_id && user.id !== listingData.researcher_id) {
          try {
            const statusData = await friendService.checkStatus(listingData.researcher_id);
            setFriendStatus(statusData.status);
          } catch (err) {
            console.error("Error checking friend status", err);
          }
        }

      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleConnect = async () => {
    if (!listing || !currentUser) return;
    setActionLoading(true);
    try {
      await friendService.sendRequest(listing.researcher_id);
      toast.success("Friend request sent!");
      setFriendStatus('sent');
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress sx={{ color: '#64CCC5' }} />
    </Box>
  );

  if (!listing) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5">Listing not found</Typography>
      <Button onClick={() => navigate('/researcher-dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Box>
  );

  const isOwner = currentUser && (currentUser.id === listing.researcher_id || currentUser.uid === listing.researcher_id);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', pb: 8 }}>
      {/* Header / Nav */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', maxWidth: 1200, mx: 'auto' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#555' }}>Back to Dashboard</Typography>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>

          {/* Title Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Chip
                  label={listing.category || 'Research'}
                  sx={{ bgcolor: '#e0f2f1', color: '#00695c', fontWeight: 600, mb: 2 }}
                />
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a237e', mb: 1 }}>
                  {listing.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#555', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="subtitle1">
                      Researcher: <strong>{listing.researcherName || 'Unknown'}</strong>
                    </Typography>
                  </Box>

                  {/* Connect Button */}
                  {!isOwner && currentUser && (
                    <Box>
                      {friendStatus === 'none' && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PersonAddIcon />}
                          onClick={handleConnect}
                          disabled={actionLoading}
                        >
                          Connect
                        </Button>
                      )}
                      {friendStatus === 'sent' && (
                        <Chip size="small" icon={<HourglassEmptyIcon />} label="Request Sent" color="primary" variant="outlined" />
                      )}
                      {friendStatus === 'received' && (
                        <Chip size="small" label="Request Received" color="warning" variant="outlined" />
                      )}
                      {friendStatus === 'accepted' && (
                        <Chip size="small" icon={<CheckIcon />} label="Friend" color="success" variant="outlined" />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
              {/* Status Chip */}
              <Chip
                label={listing.status?.toUpperCase() || 'ACTIVE'}
                color={listing.status === 'active' ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            {/* Main Details */}
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                About the Project
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#444', mb: 4, whiteSpace: 'pre-wrap' }}>
                {listing.description || listing.summary}
              </Typography>

              {listing.description && listing.summary && listing.description !== listing.summary && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                    Summary
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555', mb: 2 }}>
                    {listing.summary}
                  </Typography>
                </>
              )}
            </Grid>

            {/* Sidebar Info */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, bgcolor: '#fafafa', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#555' }}>
                  Project Details
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MonetizationOnIcon sx={{ color: '#00897b' }} />
                  <Box>
                    <Typography variant="caption" display="block" color="textSecondary">Budget / Funding</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {listing.budget || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <CalendarTodayIcon sx={{ color: '#00897b' }} />
                  <Box>
                    <Typography variant="caption" display="block" color="textSecondary">Application Deadline</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {listing.deadline ? new Date(listing.deadline).toLocaleDateString() : 'Open'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Actions */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isOwner ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/researcher/edit-listing/${id}`)}
                    >
                      Edit Listing
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ bgcolor: '#00897b', '&:hover': { bgcolor: '#00695c' } }}
                    // onClick={() => navigate(`/collaboration/${id}`)}
                    >
                      Request to Collaborate
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    onClick={() => navigate('/researcher-dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                </Box>

              </Paper>
            </Grid>
          </Grid>

        </Paper>
      </Box>
    </Box>
  );
};

export default ListingDetailPage;