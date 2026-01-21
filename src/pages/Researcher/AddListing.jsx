import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import listingService from '../../services/listingService';
import './ResearcherDashboard.css';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  MenuItem,
  Container,
  IconButton
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

function AddListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    category: '',
    budget: '',
    deadline: ''
  });

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

    setLoading(true);
    try {
      await listingService.createListing(formData);
      toast.success("Research listing published successfully!");
      navigate('/researcher-dashboard');
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "Failed to publish listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            New Research
          </h1>
          <p style={{ color: 'var(--accent-teal)', margin: 0, fontSize: '1rem', opacity: 0.9 }}>
            Create a listing to find collaborators
          </p>
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
                placeholder="e.g. AI-driven solutions for Climate Adaptation"
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
                placeholder="A brief overview (displayed on cards)"
                helperText={`${formData.summary.length}/255 characters`}
              />

              <TextField
                label="Detailed Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
                placeholder="Describe your research goals, methodologies, and collaboration needs in detail..."
              />

              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {CATEGORIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Budget / Funding (Optional)"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. $50,000 Grant secured"
                />
              </Box>

              <TextField
                label="Application Deadline (Optional)"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: 'var(--dark-blue)',
                    color: 'white',
                    px: 4,
                    py: 1,
                    '&:hover': { bgcolor: '#334155' }
                  }}
                >
                  {loading ? 'Publishing...' : 'Publish Listing'}
                </Button>
              </Box>

            </Box>
          </form>
        </Paper>
      </Container>
    </main>
  );
}

export default AddListing;