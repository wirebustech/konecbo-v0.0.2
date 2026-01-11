import React, { useState, useEffect } from "react";
import { auth, provider, db } from "../config/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc, getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './TermsAndConditions.css';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../pages/Researcher/ResearcherDashboard.css";
import axios from "axios";
import { Typography, Box, Button as MuiButton, Paper, TextField, InputAdornment, IconButton, Divider } from "@mui/material";

// Add this above function SignInPage
const logEvent = async ({ userId, role, userName, action, details, ip, target }) => {
  try {
    await addDoc(collection(db, "logs"), {
      userId,
      role,
      userName,
      action,
      details,
      ip,
      target,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging event:", error);
  }
};

function SignInPage() {
  const [ipAddress, setIpAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's IP address
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

  // Add enhanced animations via dynamic <style>
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes neon-glow {
        0%, 100% {
          box-shadow: 0 0 5px #64CCC5, 0 0 10px #64CCC5, 0 0 20px #64CCC5;
        }
        50% {
          box-shadow: 0 0 10px #B1EDE8, 0 0 20px #B1EDE8, 0 0 30px #B1EDE8;
        }
      }
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .neon-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300%;
        height: 300%;
        background: radial-gradient(circle, rgba(99,204,200,0.2) 0%, transparent 70%);
        transform: translate(-50%, -50%) scale(0.5);
        transition: transform 0.5s ease;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Route user based on their role
  const routeUserByRole = async (user) => {
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || "researcher"; // Default to researcher
        
        await logEvent({
          userId: user.uid,
          role: userRole,
          userName: user.displayName || userData.name || "N/A",
          action: "Login",
          details: "User logged in",
          ip: ipAddress,
          target: "Sign In Page",
        });

        // Route based on role
        if (userRole === "admin") {
          // Check admin authorization
          const newAdminSnapshot = await getDocs(collection(db, "newAdmin"));
          const isAuthorizedInNewAdmin = newAdminSnapshot.docs.some(
            (doc) => doc.data().email.toLowerCase() === user.email.toLowerCase()
          );
          const isAuthorizedInUsers = userData.role === "admin";

          if (!isAuthorizedInNewAdmin && !isAuthorizedInUsers) {
            toast.error("You are not authorized to access the admin dashboard.");
            await auth.signOut();
            return;
          }
          navigate("/admin");
        } else if (userRole === "reviewer") {
          navigate("/reviewer");
        } else {
          navigate("/researcher-dashboard");
        }
      } else {
        // New user - default to researcher and create profile
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "User",
          email: user.email,
          role: "researcher",
          createdAt: serverTimestamp(),
        });

        await logEvent({
          userId: user.uid,
          role: "researcher",
          userName: user.displayName || "N/A",
          action: "Login",
          details: "New user logged in",
          ip: ipAddress,
          target: "Sign In Page",
        });

        navigate("/researcher-dashboard");
      }
    } catch (error) {
      console.error("Error routing user:", error);
      toast.error("Error determining user role. Please try again.");
    }
  };

  // Handle email/password sign in
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      await routeUserByRole(user);
    } catch (error) {
      console.error("Sign-in error:", error);
      if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      await routeUserByRole(user);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled");
      } else {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#FFFCF9",
      fontFamily: "Inter, sans-serif",
    },
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 4px 6px 0 rgba(18, 34, 56, 0.2)",
      borderRadius: "1.5rem",
      padding: "2.5rem",
      maxWidth: "400px",
      width: "100%",
      margin: "2rem auto",
      position: "relative",
      zIndex: 1,
      opacity: 0,
      transform: "translateY(20px)",
      animation: "fadeInUp 0.6s ease forwards",
      backgroundImage: "radial-gradient(circle at 2px 2px, rgba(99,204,200,0.05) 2px, transparent 0)",
      backgroundSize: "40px 40px"
    },
    button: {
      backgroundColor: "#132238",
      color: "#FFFFFF",
      padding: "1rem 2rem",
      borderRadius: "8rem",
      border: "none",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "1rem",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      position: "relative",
      overflow: "hidden",
    },
    footer: {
      backgroundColor: "#364E68",
      color: "#B1EDE8",
      padding: "2rem",
      marginTop: "auto",
      textAlign: "center",
    },
    footerLinks: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginBottom: "1rem",
    },
    footerLink: {
      color: "#2a3a57",
      textDecoration: "none",
      fontSize: "0.9rem",
    },
  };

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

      {/* Sign-In Section */}
      <Box sx={{ position: "relative", zIndex: 10, padding: { xs: "1rem", sm: "2rem" } }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: "440px",
            width: "100%",
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
        <Box sx={{ mb: 3, textAlign: "center" }}>
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
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#424242",
              fontSize: "0.95rem",
            }}
          >
            Sign in to continue to your account
          </Typography>
        </Box>

        <form onSubmit={handleEmailSignIn}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
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
                    boxShadow: "0 0 0 3px rgba(255, 107, 53, 0.15)",
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: "#FF6B35",
                },
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
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
                    boxShadow: "0 0 0 3px rgba(255, 107, 53, 0.15)",
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: "#FF6B35",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <MuiButton
                component={Link}
                to="/forgot-password"
                sx={{
                  textTransform: "none",
                  color: "#64CCC5",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: 0,
                  minWidth: "auto",
                  '&:hover': {
                    backgroundColor: "transparent",
                    color: "#4A9B94",
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </MuiButton>
            </Box>
            <MuiButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
              backgroundColor: "#1B5E20",
              color: "#FFFFFF",
              padding: "0.875rem 1.5rem",
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
                  backgroundColor: "#94A3B8",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </MuiButton>
          </Box>
        </form>

        <Divider sx={{ my: 3, color: "#E2E8F0" }}>
          <Typography variant="body2" sx={{ color: "#64748B", px: 2 }}>
            OR
          </Typography>
        </Divider>

        <MuiButton
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "#E2E8F0",
            color: "#132238",
            padding: "0.875rem 1.5rem",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            backgroundColor: "#FFFFFF",
            transition: "all 0.3s ease",
            '&:hover': {
              borderColor: "#CBD5E1",
              backgroundColor: "#F8FAFC",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
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
        </Paper>
      </Box>

      <Box 
        sx={{ 
          mt: 4, 
          textAlign: 'center', 
          maxWidth: "440px", 
          margin: "2rem auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: "rgba(255, 255, 255, 0.9)", 
            mb: 2,
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          New to Konecbo?
        </Typography>
        <MuiButton
          component={Link}
          to="/signup"
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "rgba(255, 107, 53, 0.5)",
            color: "#FFFFFF",
            borderWidth: 2,
            padding: "0.875rem 1.5rem",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            background: "rgba(255, 107, 53, 0.15)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            '&:hover': {
              borderColor: "#FF6B35",
              backgroundColor: "rgba(255, 107, 53, 0.25)",
              borderWidth: 2,
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(255, 107, 53, 0.3)",
            },
          }}
        >
          Create Free Account
        </MuiButton>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "rgba(255, 255, 255, 0.8)", 
            mt: 2, 
            fontSize: "0.875rem",
            lineHeight: 1.6,
          }}
        >
          Join thousands of researchers collaborating on groundbreaking projects worldwide.
        </Typography>
      </Box>

      <Box sx={{ position: "relative", zIndex: 10, mt: 4 }}>
        <Footer />
      </Box>
    </main>
  );
}

export default SignInPage;