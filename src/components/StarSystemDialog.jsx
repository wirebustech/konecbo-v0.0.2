import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Grid
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const StarSystemDialog = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--dark-blue)',
                pt: 4,
                pb: 2
            }}>
                The Star System Explained
            </DialogTitle>

            <DialogContent sx={{ p: 4, pt: 0 }}>
                <Grid container spacing={4}>
                    {/* Contributor Stars */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: 'rgba(255, 215, 0, 0.1)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                <StarIcon sx={{ color: '#FFD700', fontSize: 40 }} />
                                <Typography variant="h5" fontWeight={700} color="var(--dark-blue)">
                                    Contributor Stars
                                </Typography>
                            </Box>
                            <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                                Earned by posting research projects that are vetted and approved.
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant="body2" color="text.secondary">
                                        Awarded only after your project passes reviewer vetting
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2" color="text.secondary">
                                        Reflects your role as someone who creates collaboration opportunities
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2" color="text.secondary">
                                        Multiple approved projects = multiple stars
                                    </Typography>
                                </li>
                            </ul>
                        </Box>
                    </Grid>

                    {/* Collaborator Stars */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                <HandshakeIcon sx={{ color: '#4CAF50', fontSize: 40 }} />
                                <Typography variant="h5" fontWeight={700} color="var(--dark-blue)">
                                    Collaborator Stars
                                </Typography>
                            </Box>
                            <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                                Earned by successfully joining and contributing to research projects.
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant="body2" color="text.secondary">
                                        Reflects your reliability and value as a research partner
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2" color="text.secondary">
                                        Builds your reputation for quality collaboration
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2" color="text.secondary">
                                        Increases your visibility to project leads
                                    </Typography>
                                </li>
                            </ul>
                        </Box>
                    </Grid>

                    {/* Why Stars Matter */}
                    <Grid item xs={12}>
                        <Box sx={{
                            mt: 2,
                            p: 4,
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, var(--dark-blue) 0%, #1e4b85 100%)',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(30, 60, 90, 0.2)'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                                <Typography variant="h5" fontWeight={700}>
                                    Why Stars Matter
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>Build Trust</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>Increase Visibility</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>Show Participation</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>Track Success</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2, justifyContent: 'center' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    size="large"
                    sx={{
                        borderRadius: 50,
                        px: 6,
                        py: 1.5,
                        bgcolor: 'var(--light-blue)',
                        color: 'var(--dark-blue)',
                        fontWeight: 700,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                        '&:hover': {
                            bgcolor: '#5AA9A3',
                            color: 'white',
                            transform: 'scale(1.05)'
                        }
                    }}
                >
                    Got it!
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StarSystemDialog;
