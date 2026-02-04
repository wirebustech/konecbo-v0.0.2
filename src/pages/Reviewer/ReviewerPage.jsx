import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';


const ReviewerPage = ({ adminView = false }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: adminView ? 'auto' : '100vh',
      bgcolor: adminView ? 'transparent' : '#f7fafc',
      p: adminView ? 0 : 5,
      textAlign: 'center'
    }}>
      <Paper sx={{
        p: 5,
        borderRadius: 4,
        maxWidth: 600,
        mx: 'auto',
        mt: adminView ? 2 : 5,
        boxShadow: adminView ? 'none' : undefined
      }}>
        <Typography variant="h4" sx={{ color: '#132238', mb: 2, fontWeight: 700 }}>
          {adminView ? 'Reviewer Portal Access' : 'Reviewer Portal Update'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
          {adminView
            ? "You are viewing the Reviewer Portal as an Admin. The portal interface is currently undergoing maintenance."
            : "The Reviewer Portal is currently undergoing scheduled maintenance for a database migration."}
        </Typography>

        {!adminView && (
          <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: '#64CCC5' }}>
            Return to Home
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default ReviewerPage;