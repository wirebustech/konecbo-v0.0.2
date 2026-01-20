import React from 'react';
import { Box, Typography } from '@mui/material';

const ReviewsDialog = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2 }}>
      <Typography>Reviews Dialog Unavailable</Typography>
    </Box>
  );
};

export default ReviewsDialog;