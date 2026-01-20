import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import './TermsAndConditions.css';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../pages/Researcher/ResearcherDashboard.css";
import axios from "axios";
import authService from "../services/authService";
import { Typography, Box, Button as MuiButton, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, InputAdornment, IconButton } from "@mui/material";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    region: "",
    agreeToTerms: false,

    // Step 2: Research Profile
    currentPosition: "",
    institution: "",
    customInstitution: "",
    country: "",
    customCountry: "",
    primaryDiscipline: "",
    subDiscipline: "",
    researchInterests: "",
    languages: "",

    // Step 3: Academic Background
    highestDegree: "",
    degreeField: "",
    institutionName: "",
    graduationYear: "",
    orcidId: "",
    institutionalEmail: "",

    // Step 4: Research Experience
    yearsOfExperience: "",
    numberOfPublications: "",
    publications: "",
    pastProjects: "",
    skills: "",
    methodologies: "",

    // Step 5: Collaboration Preferences
    lookingToPost: false,
    lookingToJoin: false,
    preferredCollaborationTypes: [],
    timeAvailability: "",
    availabilityHours: "",
    careerGoals: "",

    // Step 6: Additional Information
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
    researchStatement: "",
  });

  const steps = [
    "Basic Information",
    "Research Profile",
    "Academic Background",
    "Research Experience",
    "Collaboration Preferences",
    "Additional Information"
  ];

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    fetchIpAddress();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.email || !formData.fullName || !formData.phoneNumber || !formData.region) {
          toast.error("Please fill in all required fields (Name, Email, Phone, Region)");
          return false;
        }
        if (!formData.password || !formData.confirmPassword) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return false;
        }
        if (!formData.agreeToTerms) {
          toast.error("You must agree to the Terms and Conditions");
          return false;
        }
        return true;
      case 1:
        if (!formData.currentPosition || !formData.primaryDiscipline) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      // 1. Register User via Node.js Backend
      await authService.register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.region
      );

      // 2. Prepare KYC Data
      const kycData = {
        // Basic Info
        email: formData.email,
        name: formData.fullName,

        // Research Profile
        currentPosition: formData.currentPosition,
        institution: formData.institution === 'Other' ? formData.customInstitution : formData.institution,
        country: formData.country === 'Other' ? formData.customCountry : formData.country,
        primaryDiscipline: formData.primaryDiscipline,
        subDiscipline: formData.subDiscipline,
        researchInterests: formData.researchInterests.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),

        // Academic Background
        highestDegree: formData.highestDegree,
        degreeField: formData.degreeField,
        institutionName: formData.institutionName,
        graduationYear: formData.graduationYear,
        orcidId: formData.orcidId,
        institutionalEmail: formData.institutionalEmail,

        // Research Experience
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        numberOfPublications: parseInt(formData.numberOfPublications) || 0,
        publications: formData.publications.split('\n').filter(p => p.trim()),
        pastProjects: formData.pastProjects,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        methodologies: formData.methodologies.split(',').map(s => s.trim()).filter(s => s),

        // Collaboration Preferences
        lookingToPost: formData.lookingToPost,
        lookingToJoin: formData.lookingToJoin,
        preferredCollaborationTypes: formData.preferredCollaborationTypes,
        timeAvailability: formData.timeAvailability,
        availabilityHours: formData.availabilityHours,
        careerGoals: formData.careerGoals,

        // Additional Information
        bio: formData.bio,
        website: formData.website,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        researchStatement: formData.researchStatement,

        // Metadata
        kycCompleted: true,
        ipAddress: ipAddress,
        profileCompleteness: calculateProfileCompleteness(),
      };

      // 3. Update Profile via Node.js Backend
      await authService.updateProfile(kycData);

      toast.success("Account created successfully! Welcome to Konecbo!");

      // Navigate to appropriate dashboard
      navigate("/researcher-dashboard");
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error && error.message && error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || "Sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompleteness = () => {
    const fields = [
      formData.fullName, formData.email, formData.currentPosition,
      formData.institution, formData.primaryDiscipline, formData.highestDegree,
      formData.bio, formData.researchInterests, formData.skills
    ];
    const filledFields = fields.filter(f => f && f.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Modern form field styling
  const modernTextFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: "12px",
      backgroundColor: "#FAFBFC",
      transition: "all 0.2s ease",
      '&:hover': {
        backgroundColor: "#F5F7FA",
      },
      '&.Mui-focused': {
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 0 3px rgba(255, 107, 53, 0.15)",
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: "#FF6B35",
    },
  };

  const modernSelectStyle = {
    borderRadius: "12px",
    backgroundColor: "#FAFBFC",
    transition: "all 0.2s ease",
    '&:hover': {
      backgroundColor: "#F5F7FA",
    },
    '&.Mui-focused': {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 0 0 3px rgba(255, 107, 53, 0.15)",
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "#E2E8F0",
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: "#81C784",
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: "#FF6B35",
    },
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                  background: "linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748B" }}>
                Join the research community
              </Typography>
            </Box>

            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              fullWidth
              sx={modernTextFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#FF6B35" }} />
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
              helperText="Institutional email recommended for verification."
              sx={modernTextFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#FF6B35" }} />
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
              sx={modernTextFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "#FF6B35" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              required
              fullWidth
              sx={modernTextFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon sx={{ color: "#FF6B35" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
              helperText="Minimum 8 characters, include letters and numbers"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#64748B" }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={modernTextFieldStyle}
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
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: "#64748B" }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={modernTextFieldStyle}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  sx={{
                    color: "#FF6B35",
                    '&.Mui-checked': {
                      color: "#FF6B35",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.875rem" }}>
                  I agree to Konecbo's <Link to="/terms" target="_blank" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>Terms and Conditions</Link> and <Link to="/privacy-policy" target="_blank" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>
                </Typography>
              }
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel sx={{ '&.Mui-focused': { color: "#FF6B35" } }}>Current Position</InputLabel>
              <Select
                name="currentPosition"
                value={formData.currentPosition}
                onChange={(e) => handleSelectChange('currentPosition', e.target.value)}
                label="Current Position"
                sx={modernSelectStyle}
              >
                <MenuItem value="Undergraduate Student">Undergraduate Student</MenuItem>
                <MenuItem value="Graduate Student (Master's)">Graduate Student (Master's)</MenuItem>
                <MenuItem value="Graduate Student (PhD)">Graduate Student (PhD)</MenuItem>
                <MenuItem value="Postdoctoral Researcher">Postdoctoral Researcher</MenuItem>
                <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
                <MenuItem value="Associate Professor">Associate Professor</MenuItem>
                <MenuItem value="Full Professor">Full Professor</MenuItem>
                <MenuItem value="Research Scientist">Research Scientist</MenuItem>
                <MenuItem value="Independent Researcher">Independent Researcher</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Institution/Organization"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: "#FF6B35" } }}>Country</InputLabel>
              <Select
                name="country"
                value={formData.country}
                onChange={(e) => handleSelectChange('country', e.target.value)}
                label="Country"
                sx={modernSelectStyle}
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
                <MenuItem value="Germany">Germany</MenuItem>
                <MenuItem value="France">France</MenuItem>
                <MenuItem value="South Africa">South Africa</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {formData.country === 'Other' && (
              <TextField
                label="Specify Country"
                name="customCountry"
                value={formData.customCountry}
                onChange={handleInputChange}
                fullWidth
                sx={modernTextFieldStyle}
              />
            )}

            <FormControl fullWidth required>
              <InputLabel sx={{ '&.Mui-focused': { color: "#FF6B35" } }}>Primary Research Discipline</InputLabel>
              <Select
                name="primaryDiscipline"
                value={formData.primaryDiscipline}
                onChange={(e) => handleSelectChange('primaryDiscipline', e.target.value)}
                label="Primary Research Discipline"
                sx={modernSelectStyle}
              >
                <MenuItem value="Biological Sciences">Biological Sciences</MenuItem>
                <MenuItem value="Physical Sciences">Physical Sciences</MenuItem>
                <MenuItem value="Social Sciences">Social Sciences</MenuItem>
                <MenuItem value="Engineering & Technology">Engineering & Technology</MenuItem>
                <MenuItem value="Medical & Health Sciences">Medical & Health Sciences</MenuItem>
                <MenuItem value="Agricultural Sciences">Agricultural Sciences</MenuItem>
                <MenuItem value="Humanities">Humanities</MenuItem>
                <MenuItem value="Interdisciplinary">Interdisciplinary</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Sub-Discipline"
              name="subDiscipline"
              value={formData.subDiscipline}
              onChange={handleInputChange}
              fullWidth
              helperText="Specific area within your field"
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Research Interests"
              name="researchInterests"
              value={formData.researchInterests}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="Enter 3-5 keywords separated by commas"
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Languages Spoken"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              fullWidth
              helperText="Comma-separated list (e.g., English, Spanish, French)"
              sx={modernTextFieldStyle}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: "#FF6B35" } }}>Highest Degree</InputLabel>
              <Select
                name="highestDegree"
                value={formData.highestDegree}
                onChange={(e) => handleSelectChange('highestDegree', e.target.value)}
                label="Highest Degree"
                sx={modernSelectStyle}
              >
                <MenuItem value="Bachelor's">Bachelor's</MenuItem>
                <MenuItem value="Master's">Master's</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
                <MenuItem value="MD">MD</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Degree Field"
              name="degreeField"
              value={formData.degreeField}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Institution Name"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Graduation Year"
              name="graduationYear"
              type="number"
              value={formData.graduationYear}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 1950, max: new Date().getFullYear() }}
              sx={modernTextFieldStyle}
            />

            <TextField
              label="ORCID ID (Optional)"
              name="orcidId"
              value={formData.orcidId}
              onChange={handleInputChange}
              fullWidth
              helperText="For credential validation (e.g., 0000-0000-0000-0000)"
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Institutional Email (Optional)"
              name="institutionalEmail"
              type="email"
              value={formData.institutionalEmail}
              onChange={handleInputChange}
              fullWidth
              helperText="Recommended for verification and enhanced credibility"
              sx={modernTextFieldStyle}
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Years of Research Experience"
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0 }}
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Number of Publications"
              name="numberOfPublications"
              type="number"
              value={formData.numberOfPublications}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0 }}
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Publications (Optional)"
              name="publications"
              value={formData.publications}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              helperText="List key publications, one per line (DOIs or URLs preferred)"
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Past Research Projects"
              name="pastProjects"
              value={formData.pastProjects}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="Brief description of your past research projects"
              sx={modernTextFieldStyle}
            />

            <TextField
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              fullWidth
              helperText="Separate skills with commas"
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Methodologies"
              name="methodologies"
              value={formData.methodologies}
              onChange={handleInputChange}
              fullWidth
              helperText="Separate methodologies with commas"
              sx={modernTextFieldStyle}
            />
          </Box>
        );

      case 4:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Collaboration Preferences</Typography>
            <FormControlLabel
              control={<Checkbox checked={formData.lookingToPost} onChange={handleInputChange} name="lookingToPost" />}
              label="Looking to Post Projects"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.lookingToJoin} onChange={handleInputChange} name="lookingToJoin" />}
              label="Looking to Join Projects"
            />
            <TextField
              label="Time Availability"
              name="timeAvailability"
              value={formData.timeAvailability}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Availability Hours"
              name="availabilityHours"
              value={formData.availabilityHours}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Career Goals"
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              sx={modernTextFieldStyle}
            />
          </Box>
        );
      case 5:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />
            <TextField
              label="LinkedIn Profile"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Twitter / X Profile"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              fullWidth
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Research Statement"
              name="researchStatement"
              value={formData.researchStatement}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              sx={modernTextFieldStyle}
            />
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          {/* Stepper would go here if I kept the stepper imports, assuming usage of Mui Stepper */}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <MuiButton
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ color: "#64748B" }}
              >
                Back
              </MuiButton>

              {activeStep === steps.length - 1 ? (
                <MuiButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: "#FF6B35",
                    '&:hover': { background: "#E85A2D" },
                    borderRadius: "8px",
                    px: 4
                  }}
                >
                  {loading ? "Creating Account..." : "Complete Registration"}
                </MuiButton>
              ) : (
                <MuiButton
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    background: "#FF6B35",
                    '&:hover': { background: "#E85A2D" },
                    borderRadius: "8px",
                    px: 4
                  }}
                >
                  Next
                </MuiButton>
              )}
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Already have an account?{" "}
              <Link to="/signin" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default SignUpPage;
