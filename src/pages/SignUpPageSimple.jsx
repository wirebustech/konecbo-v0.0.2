import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import authService from "../services/authService";
import Footer from "../components/Footer";
import {
    Typography,
    Box,
    Button as MuiButton,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Container,
    Checkbox,
    FormControlLabel
} from "@mui/material";

const REGIONS = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Middle East",
    "Caribbean",
    "Central America"
];

function SignUpPageSimple() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        region: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name");
            return false;
        }
        if (!formData.email.trim()) {
            toast.error("Please enter your email address");
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            toast.error("Please enter your phone number");
            return false;
        }
        if (!formData.region) {
            toast.error("Please select your region");
            return false;
        }
        if (!formData.password) {
            toast.error("Please enter a password");
            return false;
        }
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (!agreedToTerms) {
            toast.error("Please agree to the Terms & Conditions and Privacy Policy");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await authService.register(
                formData.email,
                formData.password,
                formData.fullName,
                formData.phoneNumber,
                formData.region
            );

            if (result.success) {
                toast.success("Account created successfully! Welcome to Konecbo!");
                navigate("/researcher-dashboard");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error && error.message && error.message.includes("already registered")) {
                toast.error("This email is already registered. Please sign in instead.");
            } else {
                toast.error(error.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#e6f4ff",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
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
                        backdropFilter: "blur(10px)",
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
                        backdropFilter: "blur(10px)",
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

            {/* Main Content */}
            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 10, py: { xs: 2, sm: 4 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: { xs: "2rem 1.5rem", sm: "3rem 2.5rem" },
                        background: "rgba(255, 255, 255, 0.98)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "24px",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.9)",
                    }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 4, textAlign: "center" }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Join Konecbo
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#64748B",
                                fontSize: { xs: "0.875rem", sm: "0.95rem" },
                            }}
                        >
                            Create your account and start collaborating
                        </Typography>
                    </Box>

                    {/* Sign-Up Form */}
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            {/* Full Name */}
                            <TextField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                placeholder="John Doe"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: "#667eea" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "12px",
                                        backgroundColor: "#F8FAFC",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            backgroundColor: "#F1F5F9",
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#667eea",
                                    },
                                }}
                            />

                            {/* Email */}
                            <TextField
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                placeholder="john@example.com"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: "#764ba2" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "12px",
                                        backgroundColor: "#F8FAFC",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            backgroundColor: "#F1F5F9",
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 0 0 3px rgba(118, 75, 162, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#764ba2",
                                    },
                                }}
                            />

                            {/* Phone Number */}
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                placeholder="+1 234 567 8900"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon sx={{ color: "#f093fb" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "12px",
                                        backgroundColor: "#F8FAFC",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            backgroundColor: "#F1F5F9",
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 0 0 3px rgba(240, 147, 251, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#f093fb",
                                    },
                                }}
                            />

                            {/* Region */}
                            <TextField
                                select
                                label="Region"
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PublicIcon sx={{ color: "#4facfe" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "12px",
                                        backgroundColor: "#F8FAFC",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            backgroundColor: "#F1F5F9",
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 0 0 3px rgba(79, 172, 254, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#4facfe",
                                    },
                                }}
                            >
                                {REGIONS.map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Password */}
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                placeholder="Minimum 8 characters"
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
                                        backgroundColor: "#F8FAFC",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            backgroundColor: "#F1F5F9",
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#667eea",
                                    },
                                }}
                            />

                            {/* Confirm Password */}
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
                                        backgroundColor: "#F8FAFC",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            backgroundColor: "#F1F5F9",
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#667eea",
                                    },
                                }}
                            />

                            {/* Terms & Conditions Agreement */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        sx={{
                                            color: "#10b981",
                                            '&.Mui-checked': {
                                                color: "#10b981",
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.875rem" }}>
                                        I agree to the{" "}
                                        <Link
                                            to="/terms-and-conditions"
                                            target="_blank"
                                            style={{
                                                color: "#10b981",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            Terms & Conditions
                                        </Link>
                                        {" "}and{" "}
                                        <Link
                                            to="/privacy-policy"
                                            target="_blank"
                                            style={{
                                                color: "#10b981",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </Typography>
                                }
                                sx={{ mt: 1, mb: 1 }}
                            />

                            {/* Submit Button */}
                            <MuiButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
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
                                    mt: 1,
                                    '&:hover': {
                                        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                        boxShadow: "0 12px 28px rgba(16, 185, 129, 0.4)",
                                        transform: "translateY(-2px)",
                                    },
                                    '&:active': {
                                        transform: "translateY(0)",
                                    },
                                    '&:disabled': {
                                        background: "#CBD5E1",
                                        color: "#94A3B8",
                                    },
                                }}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </MuiButton>
                        </Box>
                    </form>

                    {/* Sign In Link */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.875rem" }}>
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                style={{
                                    color: "#10b981",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>

                    {/* Info Note */}
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            backgroundColor: "#D1FAE5",
                            borderRadius: "12px",
                            border: "1px solid #6EE7B7",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#047857",
                                fontSize: "0.8rem",
                                display: "block",
                                textAlign: "center",
                            }}
                        >
                            💡 After signing up, you can complete your profile with research interests, institution details, and more!
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* Footer */}
            <Footer />
        </Box>
    );
}

export default SignUpPageSimple;
