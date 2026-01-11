import React, { useState, useEffect } from "react";
import { auth, db, provider } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './TermsAndConditions.css';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../pages/Researcher/ResearcherDashboard.css";
import axios from "axios";
import { Typography, Box, Button as MuiButton, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Stepper, Step, StepLabel, RadioGroup, Radio, FormLabel, InputAdornment, IconButton, Chip, LinearProgress } from "@mui/material";

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

  const handleCheckboxArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const validateStep = (step) => {
    const isGoogleUser = auth.currentUser && !formData.password;
    
    switch (step) {
      case 0:
        if (!formData.email || !formData.fullName) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (!isGoogleUser) {
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

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        // User already exists, just sign them in
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        toast.success("Welcome back to Konecbo!");
        navigate("/researcher-dashboard");
        return;
      }

      // New user - pre-fill form with Google data and continue with KYC
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        fullName: user.displayName || "",
      }));

      // Get auth token
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Save basic user info first
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "User",
        email: user.email,
        role: "researcher",
        kycCompleted: false,
        createdAt: serverTimestamp(),
        provider: "google",
      });

      toast.info("Please complete your profile to continue");
      // User will complete the KYC form starting from step 0 (terms agreement)
      // Password fields will be hidden for Google users in step 0
    } catch (error) {
      console.error("Google sign-up error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-up cancelled");
      } else {
        toast.error("Google sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      let user;
      let isGoogleUser = false;

      // Check if user is already authenticated (Google sign-up)
      if (auth.currentUser) {
        user = auth.currentUser;
        isGoogleUser = true;
      } else {
        // Create new user account with email/password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        user = userCredential.user;

        // Update display name
        await updateProfile(user, {
          displayName: formData.fullName
        });
      }

      // Get auth token
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Prepare KYC data
      const kycData = {
        // Basic Info
        email: formData.email,
        name: formData.fullName,
        createdAt: serverTimestamp(),
        
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
        kycCompletedAt: serverTimestamp(),
        ipAddress: ipAddress,
        profileCompleteness: calculateProfileCompleteness(),
      };

      // Save to Firestore - update existing or create new
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Update existing user (Google sign-up case)
        await setDoc(userDocRef, {
          name: formData.fullName,
          email: formData.email,
          role: "researcher",
          kycData: kycData,
          kycCompleted: true,
          kycCompletedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        // Create new user
        await setDoc(userDocRef, {
          name: formData.fullName,
          email: formData.email,
          role: "researcher",
          kycData: kycData,
          kycCompleted: true,
          kycCompletedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          provider: isGoogleUser ? "google" : "email",
        });
      }

      // Also save detailed profile (create or update)
      await setDoc(doc(db, "user-profiles", user.uid), kycData, { merge: true });

      toast.success("Account created successfully! Welcome to Konecbo!");
      
      // Navigate to appropriate dashboard
      navigate("/researcher-dashboard");
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error("Sign-up failed. Please try again.");
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
    const isGoogleUser = auth.currentUser && !formData.password;
    
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isGoogleUser && (
              <Box sx={{ p: 2, backgroundColor: "#E3F2FD", borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#1976D2" }}>
                  ✓ Signed in with Google. Please complete your profile information below.
                </Typography>
              </Box>
            )}
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              fullWidth
              sx={modernTextFieldStyle}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={isGoogleUser}
              helperText="Any email address works. Institutional email recommended for verification."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                  backgroundColor: "#FAFBFC",
                  transition: "all 0.2s ease",
                  '&:hover': {
                    backgroundColor: "#F5F7FA",
                  },
                  '&.Mui-focused': {
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 0 0 3px rgba(100, 204, 197, 0.1)",
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: "#64CCC5",
                },
              }}
            />
            {!isGoogleUser && (
              <>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#FAFBFC",
                      transition: "all 0.2s ease",
                      '&:hover': {
                        backgroundColor: "#F5F7FA",
                      },
                      '&.Mui-focused': {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 0 0 3px rgba(100, 204, 197, 0.1)",
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: "#64CCC5",
                    },
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#FAFBFC",
                      transition: "all 0.2s ease",
                      '&:hover': {
                        backgroundColor: "#F5F7FA",
                      },
                      '&.Mui-focused': {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 0 0 3px rgba(100, 204, 197, 0.1)",
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: "#64CCC5",
                    },
                  }}
                />
              </>
            )}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                  backgroundColor: "#FAFBFC",
                  transition: "all 0.2s ease",
                  '&:hover': {
                    backgroundColor: "#F5F7FA",
                  },
                  '&.Mui-focused': {
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 0 0 3px rgba(100, 204, 197, 0.1)",
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: "#64CCC5",
                },
              }}
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
              label="Skills & Expertise"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="Comma-separated list (e.g., Python, Statistical Analysis, Lab Techniques)"
              sx={modernTextFieldStyle}
            />
            
            <TextField
              label="Research Methodologies"
              name="methodologies"
              value={formData.methodologies}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              helperText="Comma-separated list (e.g., Experimental Design, Qualitative Research, Data Analysis)"
              sx={modernTextFieldStyle}
            />
          </Box>
        );
      
      case 4:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.lookingToPost}
                    onChange={(e) => handleSelectChange('lookingToPost', e.target.checked)}
                    sx={{
                      color: "#64CCC5",
                      '&.Mui-checked': {
                        color: "#64CCC5",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: "#1B5E20", fontSize: "0.95rem" }}>I'm looking to post research projects</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.lookingToJoin}
                    onChange={(e) => handleSelectChange('lookingToJoin', e.target.checked)}
                    sx={{
                      color: "#FF6B35",
                      '&.Mui-checked': {
                        color: "#FF6B35",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: "#1B5E20", fontSize: "0.95rem" }}>I'm looking to join research projects as a collaborator</Typography>}
              />
            </FormGroup>
            
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ color: "#1B5E20", fontWeight: 600, mb: 1 }}>Preferred Collaboration Types</FormLabel>
              <FormGroup>
                {['Equal Partnership', 'Lead Researcher with Contributors', 'Specific Task-Based Contribution', 'Advisory Role', 'Consultative'].map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={formData.preferredCollaborationTypes.includes(type)}
                        onChange={() => handleCheckboxArrayChange('preferredCollaborationTypes', type)}
                        sx={{
                          color: "#FF6B35",
                          '&.Mui-checked': {
                            color: "#FF6B35",
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: "#1B5E20", fontSize: "0.95rem" }}>{type}</Typography>}
                  />
                ))}
              </FormGroup>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: "#FF6B35" } }}>Time Availability</InputLabel>
              <Select
                name="timeAvailability"
                value={formData.timeAvailability}
                onChange={(e) => handleSelectChange('timeAvailability', e.target.value)}
                label="Time Availability"
                sx={modernSelectStyle}
              >
                <MenuItem value="A few hours per week">A few hours per week</MenuItem>
                <MenuItem value="5-10 hours per week">5-10 hours per week</MenuItem>
                <MenuItem value="10-20 hours per week">10-20 hours per week</MenuItem>
                <MenuItem value="20+ hours per week">20+ hours per week</MenuItem>
                <MenuItem value="Variable/Flexible">Variable/Flexible</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Career Goals & Learning Objectives"
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="What do you hope to achieve through research collaboration?"
              sx={modernTextFieldStyle}
            />
          </Box>
        );
      
      case 5:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Biography"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              helperText="Brief professional biography"
              sx={modernTextFieldStyle}
            />
            
            <TextField
              label="Personal Website (Optional)"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              fullWidth
              type="url"
              sx={modernTextFieldStyle}
            />
            
            <TextField
              label="LinkedIn Profile (Optional)"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              fullWidth
              type="url"
              sx={modernTextFieldStyle}
            />
            
            <TextField
              label="Twitter/X Handle (Optional)"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              fullWidth
              helperText="e.g., @username"
              sx={modernTextFieldStyle}
            />
            
            <TextField
              label="Research Statement (Optional)"
              name="researchStatement"
              value={formData.researchStatement}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={5}
              helperText="Your research philosophy, current focus, and future directions"
              sx={modernTextFieldStyle}
            />
          </Box>
        );
      
      default:
        return null;
    }
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <main 
      role="main" 
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 25%, #4CAF50 50%, #66BB6A 75%, #81C784 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(46, 125, 50, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Navbar */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Navbar />
      </Box>

      {/* Header */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          padding: { xs: "1.5rem", sm: "2rem" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MuiButton
          onClick={() => navigate(-1)}
          sx={{
            color: "#FFFFFF",
            minWidth: 0,
            p: 1.5,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease",
            '&:hover': {
              background: "rgba(255, 255, 255, 0.2)",
              transform: "translateX(-2px)",
            },
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: "1.2rem" }} />
        </MuiButton>

        <MuiButton
          onClick={() => navigate("/")}
          sx={{
            color: "#FFFFFF",
            px: 2.5,
            py: 1,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontWeight: 500,
            fontSize: "0.95rem",
            textTransform: "none",
            transition: "all 0.3s ease",
            '&:hover': {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          Home
        </MuiButton>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ position: "relative", zIndex: 10, px: { xs: 2, sm: 4 }, mb: 2 }}>
        <Box sx={{ maxWidth: "900px", margin: "0 auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>
              {Math.round(progressPercentage)}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)",
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ position: "relative", zIndex: 10, padding: { xs: "1rem", sm: "2rem" } }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: { xs: "2rem 1.5rem", sm: "3rem 2.5rem" },
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(19, 34, 56, 0.12), 0 0 1px rgba(19, 34, 56, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            animation: "fadeInUp 0.6s ease forwards",
          }}
        >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2rem" },
              color: "#1B5E20",
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Create Your Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#424242",
              fontSize: "0.95rem",
            }}
          >
            Join thousands of researchers worldwide
          </Typography>
        </Box>

        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: '#FF6B35',
            },
            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
              color: '#FF6B35',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: '#1B5E20',
            },
            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
              color: '#1B5E20',
              fontWeight: 600,
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <Box sx={{ mb: 4, minHeight: "400px" }}>
            {renderStepContent()}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
            <MuiButton
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              sx={{ 
                color: "#424242",
                textTransform: "none",
                fontWeight: 500,
                minWidth: "100px",
                '&:hover': {
                  backgroundColor: "rgba(46, 125, 50, 0.1)",
                },
                '&:disabled': {
                  color: "#9E9E9E",
                },
              }}
            >
              Back
            </MuiButton>
            {activeStep === steps.length - 1 ? (
              <MuiButton
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#1B5E20",
                  color: "#FFFFFF",
                  padding: "0.875rem 2rem",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(27, 94, 32, 0.3)",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    backgroundColor: "#2E7D32",
                    boxShadow: "0 6px 20px rgba(27, 94, 32, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  '&:active': {
                    transform: "translateY(0)",
                  },
                  '&:disabled': {
                    backgroundColor: "#9E9E9E",
                  },
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </MuiButton>
            ) : (
              <MuiButton
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#1B5E20",
                  color: "#FFFFFF",
                  padding: "0.875rem 2rem",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(27, 94, 32, 0.3)",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    backgroundColor: "#2E7D32",
                    boxShadow: "0 6px 20px rgba(27, 94, 32, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  '&:active': {
                    transform: "translateY(0)",
                  },
                }}
              >
                Next
              </MuiButton>
            )}
          </Box>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2, color: "#424242" }}>
            Or sign up with
          </Typography>
          <MuiButton
            onClick={handleGoogleSignUp}
            disabled={loading}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#E0E0E0",
              color: "#1B5E20",
              padding: "0.875rem 1.5rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 500,
              textTransform: "none",
              backgroundColor: "#FFFFFF",
              transition: "all 0.3s ease",
              '&:hover': {
                borderColor: "#81C784",
                backgroundColor: "#F1F8F4",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.15)",
              },
              '&:disabled': {
                borderColor: "#E0E0E0",
                color: "#9E9E9E",
              },
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
              style={{ height: "20px", width: "20px", marginRight: "12px" }}
            />
            Continue with Google
          </MuiButton>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: "#424242" }}>
            Already have an account? <Link to="/signin" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </Typography>
        </Box>
        </Paper>
      </Box>

      <Box sx={{ position: "relative", zIndex: 10, mt: 4 }}>
        <Footer />
      </Box>
    </main>
  );
};

export default SignUpPage;

