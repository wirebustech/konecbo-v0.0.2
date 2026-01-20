// ListingDetailPage.jsx - Displays detailed information about a research listing
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ListingDetailPage.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Typography, Button, IconButton, CircularProgress, Chip } from '@mui/material';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    // Simulate loading or fetch from backend if available
    setLoading(true);
    setTimeout(() => {
      // Mock data or failure
      setLoading(false);
      // Since backend listings don't exist yet:
      // setListing(null); or mock one:
      /*
      setListing({
          title: "Mock Listing (Backend Pending)",
          summary: "This listing data is unavailable as the backend is being migrated.",
          userId: "mock-user"
      });
      */
    }, 500);
  }, [id]);

  if (loading) return (
    <Box className="loading-container">
      <CircularProgress sx={{ color: '#64CCC5', mb: 2 }} />
      <Typography>Loading listing details...</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', p: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIosIcon />
      </IconButton>
      <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Listing Pending Migration
        </Typography>
        <Typography variant="body1">
          The research listings database is currently being migrated.
          Full details for listing ID {id} are not available at this moment.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/researcher-dashboard')} sx={{ mt: 3 }}>
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ListingDetailPage;