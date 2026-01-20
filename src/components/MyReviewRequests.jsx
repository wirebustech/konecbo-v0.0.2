import React from 'react';
import { Box, Typography } from '@mui/material';

const MyReviewRequests = () => {
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary">
        My Review Requests Unavailable
      </Typography>
    </Box>
  );
};

export default MyReviewRequests;