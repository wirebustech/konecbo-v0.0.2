import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import './TermsAndConditions.css';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../pages/Researcher/ResearcherDashboard.css";
import authService from "../services/authService";
import {
  Typography,
  Box,
  Button as MuiButton,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  Checkbox,
  FormControlLabel,
  Link as MuiLink
} from "@mui/material";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phoneNumber: "",
    researchInterests: "",
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.country || !formData.phoneNumber || !formData.researchInterests) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the Terms and Conditions.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.country,
        formData.researchInterests
      );

      toast.success("Account created successfully!");
      // Redirect to signin or dashboard (if auto-login implemented)
      // Usually register returns token, authService stores it.
      // So we can go to dashboard.
      navigate('/researcher-dashboard');

    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ flex: 1, display: "flex", alignItems: "center", py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, width: "100%", borderRadius: 4, bgcolor: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>

          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
              Join Konecbo
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Create your researcher account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Country of Residence"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Research Interests"
                name="researchInterests"
                value={formData.researchInterests}
                onChange={handleInputChange}
                required
                fullWidth
                placeholder="e.g. AI, Climate Change, Data Science"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                helperText="Separate multiple interests with commas"
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    name="agreeToTerms"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    I agree to the <Link to="/terms" style={{ color: "#0f172a", fontWeight: 600 }}>Terms and Conditions</Link>
                  </Typography>
                }
              />

              <MuiButton
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
                sx={{
                  bgcolor: "#0f172a",
                  color: "white",
                  py: 1.5,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: 2,
                  '&:hover': { bgcolor: "#334155" }
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </MuiButton>

              <Typography variant="body2" align="center" sx={{ color: "#64748b", mt: 2 }}>
                Already have an account?{" "}
                <Link to="/signin" style={{ color: "#0f172a", fontWeight: 600, textDecoration: "none" }}>
                  Sign In
                </Link>
              </Typography>

            </Box>
          </form>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default SignUpPage;
