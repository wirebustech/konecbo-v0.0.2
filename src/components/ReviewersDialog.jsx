import React from 'react';
import { Box, Typography } from '@mui/material';

const ReviewersDialog = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, m: 2 }}>
      <Typography>Reviewers Dialog Unavailable</Typography>
    </Box>
  );
};

export default ReviewersDialog;