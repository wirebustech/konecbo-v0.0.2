import React, { useState, useEffect } from "react";
import { auth, provider } from "../config/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
    Divider,
    Container
} from "@mui/material";

function SignInPageHybrid() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Unified sign-in handler - tries SQL first, then Firebase
    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            // Try SQL database first
            try {
                const result = await authService.login(email, password);
                if (result.success) {
                    toast.success("Welcome back!");
                    const userRole = result.user.role || "researcher";
                    if (userRole === "admin") {
                        navigate("/admin");
                    } else if (userRole === "reviewer") {
                        navigate("/reviewer");
                    } else {
                        navigate("/researcher-dashboard");
                    }
                    return;
                }
            } catch (sqlError) {
                // If SQL fails, try Firebase
                console.log("SQL login failed, trying Firebase...");
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
                navigate("/researcher-dashboard");
                return;
            }
        } catch (error) {
            console.error("Sign-in error:", error);
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                toast.error("Invalid email or password");
            } else {
                toast.error(error.message || "Sign-in failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google sign-in
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Send to SQL backend
            const authResult = await authService.googleAuth(
                user.email,
                user.displayName || "User",
                user.uid,
                user.photoURL || ""
            );

            if (authResult.success) {
                toast.success("Welcome back!");
                const userRole = authResult.user.role || "researcher";
                if (userRole === "admin") {
                    navigate("/admin");
                } else if (userRole === "reviewer") {
                    navigate("/reviewer");
                } else {
                    navigate("/researcher-dashboard");
                }
            }
        } catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                toast.info("Sign-in cancelled");
            } else {
                console.error("Google sign-in error:", error);
                toast.error(error.message || "Google sign-in failed. Please try again.");
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
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#64748B",
                                fontSize: { xs: "0.875rem", sm: "0.95rem" },
                            }}
                        >
                            Sign in to continue to your account
                        </Typography>
                    </Box>

                    {/* Google Sign-In Button */}
                    <MuiButton
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        variant="outlined"
                        fullWidth
                        sx={{
                            borderColor: "#E2E8F0",
                            color: "#1E293B",
                            padding: "0.875rem 1.5rem",
                            borderRadius: "12px",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            fontWeight: 600,
                            textTransform: "none",
                            backgroundColor: "#FFFFFF",
                            mb: 3,
                            transition: "all 0.3s ease",
                            '&:hover': {
                                borderColor: "#CBD5E1",
                                backgroundColor: "#F8FAFC",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                transform: "translateY(-2px)",
                            },
                            '&:disabled': {
                                borderColor: "#E2E8F0",
                                color: "#94A3B8",
                            },
                        }}
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt=""
                            style={{
                                height: "20px",
                                width: "20px",
                                marginRight: "12px",
                            }}
                        />
                        Continue with Google
                    </MuiButton>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" sx={{ color: "#94A3B8", px: 2, fontSize: "0.875rem" }}>
                            OR
                        </Typography>
                    </Divider>

                    {/* Sign-In Form */}
                    <form onSubmit={handleSignIn}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "200%", }}>
                            {/* Email */}
                            <TextField
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                placeholder="john@example.com"
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
                                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#10b981",
                                    },
                                }}
                            />

                            {/* Password */}
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                placeholder="Enter your password"
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
                                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: "#10b981",
                                    },
                                }}
                            />

                            {/* Forgot Password Link */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                                <MuiButton
                                    component={Link}
                                    to="/forgot-password"
                                    sx={{
                                        textTransform: "none",
                                        color: "#10b981",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        padding: 0,
                                        minWidth: "auto",
                                        '&:hover': {
                                            backgroundColor: "transparent",
                                            color: "#059669",
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    Forgot password?
                                </MuiButton>
                            </Box>

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
                                {loading ? "Signing in..." : "Sign In"}
                            </MuiButton>
                        </Box>
                    </form>

                    {/* Sign Up Link */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.875rem" }}>
                            New to Konecbo?{" "}
                            <Link
                                to="/signup"
                                style={{
                                    color: "#10b981",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Create Account
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
                            🔒 Your credentials are securely encrypted and protected
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* Footer */}
            <Footer />
        </Box>
    );
}

export default SignInPageHybrid;
