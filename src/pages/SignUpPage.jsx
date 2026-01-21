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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './TermsAndConditions.css';
import Footer from "../components/Footer";
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
  FormControlLabel
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
      navigate('/researcher-dashboard');

    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Common input styles for green theme
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: "12px",
      backgroundColor: "#F8FAFC",
      transition: "all 0.2s ease",
      '&:hover': {
        backgroundColor: "#F1F5F9",
      },
      '&.Mui-focused': {
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: "#10b981",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#e6f4ff", position: "relative", overflow: "hidden", display: 'flex', flexDirection: 'column' }}>

      {/* Header Buttons */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          padding: { xs: "1rem", sm: "1.5rem" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MuiButton
          onClick={() => navigate(-1)}
          sx={{
            color: "#1E293B",
            minWidth: 0,
            p: { xs: 1, sm: 1.5 },
            borderRadius: "12px",
            background: "#FFFFFF",
            border: "1px solid #CBD5E1",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            '&:hover': {
              background: "#F8FAFC",
              transform: "translateX(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }} />
        </MuiButton>

        <MuiButton
          onClick={() => navigate("/")}
          sx={{
            color: "#1E293B",
            px: { xs: 2, sm: 2.5 },
            py: 1,
            borderRadius: "12px",
            background: "#FFFFFF",
            border: "1px solid #CBD5E1",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            textTransform: "none",
            transition: "all 0.3s ease",
            '&:hover': {
              background: "#F8FAFC",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Home
        </MuiButton>
      </Box>

      <Container maxWidth="md" sx={{ flex: 1, display: "flex", alignItems: "center", py: 4, position: 'relative', zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            width: "100%",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
          }}
        >

          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{
              fontWeight: 800,
              mb: 1,
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
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
                sx={inputSx}
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
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Country of Residence"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  sx={inputSx}
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
                  sx={inputSx}
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
                sx={inputSx}
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

              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  sx={inputSx}
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
                  sx={inputSx}
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
                    sx={{ color: '#10b981', '&.Mui-checked': { color: '#059669' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    I agree to the <Link to="/terms" style={{ color: "#059669", fontWeight: 600 }}>Terms and Conditions</Link>
                  </Typography>
                }
              />

              <MuiButton
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
                sx={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#FFFFFF",
                  padding: { xs: "0.875rem", sm: "1rem" },
                  borderRadius: "12px",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    boxShadow: "0 12px 28px rgba(16, 185, 129, 0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </MuiButton>

              <Typography variant="body2" align="center" sx={{ color: "#64748b", mt: 2 }}>
                Already have an account?{" "}
                <Link to="/signin" style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>
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
