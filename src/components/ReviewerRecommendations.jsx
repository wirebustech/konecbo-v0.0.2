import React from 'react';
import { Box, Typography } from '@mui/material';

const ReviewerRecommendations = () => {
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Reviewer Recommendations Unavailable
      </Typography>
    </Box>
  );
};

export default ReviewerRecommendations;
