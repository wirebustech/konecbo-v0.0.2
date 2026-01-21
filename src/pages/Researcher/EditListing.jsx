import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import listingService from '../../services/listingService';
import './ResearcherDashboard.css';
import {
    TextField,
    Button,
    Box,
    Paper,
    MenuItem,
    Container,
    IconButton,
    CircularProgress
} from '@mui/material';

const CATEGORIES = [
    "Artificial Intelligence",
    "Biotechnology",
    "Climate Change",
    "Computer Science",
    "Data Science",
    "Economics",
    "Education",
    "Engineering",
    "Healthcare",
    "Humanities",
    "Psychology",
    "Social Sciences",
    "Other"
];

function EditListing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        status: 'active'
    });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await listingService.getListingById(id);
                const l = response.listing;
                setFormData({
                    title: l.title || '',
                    summary: l.summary || '',
                    description: l.description || '',
                    category: l.category || '',
                    budget: l.budget || '',
                    // Format deadline for Input date (YYYY-MM-DD)
                    deadline: l.deadline ? new Date(l.deadline).toISOString().split('T')[0] : '',
                    status: l.status || 'active'
                });
            } catch (error) {
                console.error("Error loading listing:", error);
                toast.error("Failed to load listing details.");
                navigate('/researcher-dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.summary) {
            toast.error("Title and Summary are required.");
            return;
        }

        setSubmitting(true);
        try {
            await listingService.updateListing(id, formData);
            toast.success("Listing updated successfully!");
            navigate(`/listing/${id}`);
        } catch (error) {
            console.error("Error updating listing:", error);
            toast.error(error.message || "Failed to update listing.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background-main, #f7fafc)' }}>
            {/* Header */}
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, var(--dark-blue) 70%, var(--light-blue) 100%)',
                    color: 'var(--white)',
                    padding: '1.5rem 2rem',
                    boxShadow: '0 2px 12px rgba(30,60,90,0.08)'
                }}
            >
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ color: 'var(--white)', mr: 2 }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <section>
                    <h1 style={{ fontWeight: 700, fontSize: '1.8rem', margin: 0 }}>
                        Edit Project
                    </h1>
                </section>
            </header>

            {/* Main Form Content */}
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, boxShadow: "0 6px 24px rgba(30, 60, 90, 0.08)" }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            <TextField
                                label="Project Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                            />

                            <TextField
                                label="Short Summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                required
                                fullWidth
                                multiline
                                rows={2}
                                helperText={`${formData.summary.length}/255`}
                            />

                            <TextField
                                label="Detailed Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={6}
                            />

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    {CATEGORIES.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Budget / Funding"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    label="Application Deadline"
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="closed">Closed / Archived</MenuItem>
                                </TextField>
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting}
                                    sx={{
                                        bgcolor: 'var(--dark-blue)',
                                        color: 'white',
                                        px: 4,
                                        py: 1,
                                        '&:hover': { bgcolor: '#334155' }
                                    }}
                                >
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>

                        </Box>
                    </form>
                </Paper>
            </Container>
        </main>
    );
}

export default EditListing;
