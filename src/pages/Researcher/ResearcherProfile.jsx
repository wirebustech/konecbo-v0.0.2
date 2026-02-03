import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Grid, Chip, Divider,
  Button, Card, CardContent, CircularProgress, IconButton
} from '@mui/material';
import {
  School, Email, LocationOn, LinkedIn, Twitter, Language,
  Work, Book, Groups, AccessTime, Edit, Share
} from '@mui/icons-material';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const ResearcherProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        if (data && data.user) {
          setProfile({ ...data.user, ...data.user_profile });
          // Note: authService.getProfile returns { user: {...}, ... } 
          // depending on how backend sends it. 
          // Let's verify backend response structure later if needed.
          // Based on previous authController view, it returns `res.json(result.rows[0])` directly 
          // which is a flat object with user info.
          // Wait, let's re-verify authController.getProfile output.

          // Code snippet view 5 (earlier):
          // SELECT u.id, u.email, u.full_name, ... FROM users u LEFT JOIN user_profiles ...
          // So it returns a single flat object.

          if (data.id) {
            setProfile(data);
          } else if (data.user) {
            // Some implementations wrap it.
            setProfile(data.user);
          } else {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#64CCC5' }} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">Could not load profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F1F8F4', minHeight: '100vh', pb: 8 }}>
      <Box sx={{
        bgcolor: '#132238',
        color: 'white',
        pt: 10,
        pb: 12,
        mb: -6,
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item>
              <Avatar
                src={profile.avatar_url}
                alt={profile.full_name}
                sx={{
                  width: 150,
                  height: 150,
                  border: '4px solid white',
                  boxShadow: 3
                }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h3" fontWeight="bold">
                {profile.full_name}
              </Typography>
              <Typography variant="h6" sx={{ color: '#64CCC5', mb: 1 }}>
                {profile.current_position || 'Researcher'}
                {profile.institution && ` at ${profile.institution}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {profile.country && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn fontSize="small" sx={{ color: '#aaa' }} />
                    <Typography variant="body2" color="#ccc">{profile.country}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Email fontSize="small" sx={{ color: '#aaa' }} />
                  <Typography variant="body2" color="#ccc">{profile.email}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sx={{ display: 'flex', gap: 2 }}>
              {/* Actions for File Owner */}
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: '#64CCC5', color: '#64CCC5' }
                }}
                onClick={() => {
                  // Navigate to public view
                  navigate(`/researcher/${profile.id}`);
                }}
              >
                View Public
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit />}
                sx={{
                  bgcolor: '#64CCC5',
                  color: '#132238',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#5AA9A3' }
                }}
                onClick={() => navigate('/researcher-edit-profile')}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Bio */}
            <Card sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>About</Typography>
                {profile.bio ? (
                  <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                    {profile.bio}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No biography added yet. Click &quot;Edit Profile&quot; to add one.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Research Interests */}
            <Card sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Research Interests</Typography>
                {profile.research_interests && profile.research_interests.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.research_interests.map((interest, index) => (
                      <Chip key={index} label={interest} sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 500 }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No research interests listed.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Skills & Expertise</Typography>
                {profile.skills && profile.skills.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.skills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" sx={{ borderColor: '#132238', color: '#132238' }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No skills listed.
                  </Typography>
                )}
              </CardContent>
            </Card>

          </Grid>

          <Grid item xs={12} md={4}>
            {/* Details Sidebar */}
            <Card sx={{ borderRadius: 2, mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Details</Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School fontSize="small" /> Highest Degree
                  </Typography>
                  <Typography variant="body1">{profile.highest_degree || 'Not specified'}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Book fontSize="small" /> Discipline
                  </Typography>
                  <Typography variant="body1">{profile.primary_discipline || 'Not specified'}</Typography>
                  {profile.sub_discipline && (
                    <Typography variant="body2" color="textSecondary">{profile.sub_discipline}</Typography>
                  )}
                </Box>
                <Divider sx={{ my: 1 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work fontSize="small" /> Experience
                  </Typography>
                  <Typography variant="body1">{profile.years_of_experience ? `${profile.years_of_experience} years` : 'Not specified'}</Typography>
                </Box>

                {profile.languages && profile.languages.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Language fontSize="small" /> Languages
                      </Typography>
                      <Typography variant="body1">{profile.languages.join(', ')}</Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Collaboration Logic */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Collaboration</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {profile.looking_to_post && (
                    <Chip
                      icon={<Groups />}
                      label="Post Opportunities"
                      color="primary"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start', px: 1 }}
                    />
                  )}
                  {profile.looking_to_join && (
                    <Chip
                      icon={<Groups />}
                      label="Join Projects"
                      color="secondary"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start', px: 1 }}
                    />
                  )}
                  {!profile.looking_to_post && !profile.looking_to_join && (
                    <Typography variant="body2" color="text.secondary">No status set.</Typography>
                  )}
                </Box>
                {profile.time_availability && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2">{profile.time_availability}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResearcherProfile;