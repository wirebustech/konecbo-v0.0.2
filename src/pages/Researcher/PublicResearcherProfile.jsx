import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Avatar, Grid, Chip, Divider,
    Button, Card, CardContent, CircularProgress, Link as MuiLink
} from '@mui/material';
import {
    School, Email, LocationOn, LinkedIn, Twitter, Language,
    Work, Book, Groups, AccessTime
} from '@mui/icons-material';
import researcherService from '../../services/researcherService';
import { toast } from 'react-toastify';

const PublicResearcherProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await researcherService.getResearcherById(id);
                if (data.success) {
                    setProfile(data.researcher);
                } else {
                    toast.error("Could not load profile.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch researcher profile.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress sx={{ color: '#64CCC5' }} />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <Typography variant="h5" color="textSecondary">Researcher not found.</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2, color: '#64CCC5' }}>Go Back</Button>
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
                                    <Typography variant="body2" color="#ccc">{profile.institutional_email || profile.email}</Typography>
                                </Box>
                                {profile.orcid_id && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="body2" color="#ccc" sx={{ fontFamily: 'monospace' }}>ORCID: {profile.orcid_id}</Typography>
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {profile.linkedin && (
                                    <MuiLink href={profile.linkedin} target="_blank" rel="noopener" sx={{ color: 'white', '&:hover': { color: '#0077b5' } }}>
                                        <LinkedIn />
                                    </MuiLink>
                                )}
                                {profile.twitter && (
                                    <MuiLink href={profile.twitter} target="_blank" rel="noopener" sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }}>
                                        <Twitter />
                                    </MuiLink>
                                )}
                                {profile.website && (
                                    <MuiLink href={profile.website} target="_blank" rel="noopener" sx={{ color: 'white', '&:hover': { color: '#64CCC5' } }}>
                                        <Language />
                                    </MuiLink>
                                )}
                            </Box>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#64CCC5',
                                    color: '#132238',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#5AA9A3' }
                                }}
                                onClick={() => toast.info('Collaboration request feature coming soon!')}
                            >
                                Connect
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {/* Bio */}
                        {profile.bio && (
                            <Card sx={{ mb: 4, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>About</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                        {profile.bio}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Research Interests */}
                        {profile.research_interests && profile.research_interests.length > 0 && (
                            <Card sx={{ mb: 4, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Research Interests</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {profile.research_interests.map((interest, index) => (
                                            <Chip key={index} label={interest} sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 500 }} />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {/* Skills */}
                        {profile.skills && profile.skills.length > 0 && (
                            <Card sx={{ mb: 4, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Skills & Expertise</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {profile.skills.map((skill, index) => (
                                            <Chip key={index} label={skill} variant="outlined" sx={{ borderColor: '#132238', color: '#132238' }} />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {/* Research Statement */}
                        {profile.research_statement && (
                            <Card sx={{ mb: 4, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Research Statement</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                        {profile.research_statement}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Publications */}
                        {profile.publications && profile.publications.length > 0 && (
                            <Card sx={{ mb: 4, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#132238', fontWeight: 'bold' }}>Selected Publications</Typography>
                                        {profile.number_of_publications && (
                                            <Chip label={`Total: ${profile.number_of_publications}`} size="small" />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" component="div">
                                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                                            {(Array.isArray(profile.publications) ? profile.publications : profile.publications.split('\n')).map((pub, idx) => (
                                                <li key={idx} style={{ marginBottom: 8 }}>{pub}</li>
                                            ))}
                                        </ul>
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Past Projects */}
                        {profile.past_projects && (
                            <Card sx={{ mb: 4, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Past Projects</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                        {profile.past_projects}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* Details Sidebar */}
                        <Card sx={{ borderRadius: 2, mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: '#132238', fontWeight: 'bold' }}>Details</Typography>

                                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <School fontSize="small" /> Education
                                </Typography>
                                <Typography variant="body1" fontWeight="500">{profile.highest_degree || 'Not specified'}</Typography>
                                {profile.institution_name && (
                                    <Typography variant="body2" color="textSecondary">{profile.institution_name}</Typography>
                                )}
                                {profile.graduation_year && (
                                    <Typography variant="caption" color="textSecondary">Class of {profile.graduation_year}</Typography>
                                )}
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
                                    <Typography variant="body2" color="text.secondary">No specific status set.</Typography>
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
        </Box >
    );
};

export default PublicResearcherProfile;
