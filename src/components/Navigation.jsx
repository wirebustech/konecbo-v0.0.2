import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArticleIcon from "@mui/icons-material/Article";
import GavelIcon from "@mui/icons-material/Gavel";
import SchoolIcon from "@mui/icons-material/School";

const Navigation = ({ variant = "horizontal" }) => {
  const location = useLocation();

  const navLinks = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "About", icon: <InfoIcon />, path: "/about" },
    { text: "Learn More", icon: <SchoolIcon />, path: "/learn-more" },
    { text: "Sign Up", icon: <PersonAddIcon />, path: "/signup" },
    { text: "Sign In", icon: <LoginIcon />, path: "/signin" },
    { text: "Privacy Policy", icon: <ArticleIcon />, path: "/privacy-policy" },
    { text: "Terms", icon: <GavelIcon />, path: "/terms" },
  ];

  if (variant === "footer") {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: "1rem", sm: "2rem" },
          padding: "1.5rem",
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              textDecoration: "none",
              color: location.pathname === link.path ? "var(--orange-primary)" : "var(--text-medium)",
              fontWeight: location.pathname === link.path ? 600 : 400,
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--orange-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = location.pathname === link.path ? "var(--orange-primary)" : "var(--text-medium)";
            }}
          >
            <span style={{ fontSize: "1rem" }}>{link.icon}</span>
            {link.text}
          </Link>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: { xs: "0.75rem", sm: "1rem" },
        padding: "1rem",
        backgroundColor: "rgba(27, 94, 32, 0.05)",
        borderRadius: "12px",
        border: "1px solid rgba(46, 125, 50, 0.2)",
      }}
    >
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            backgroundColor: location.pathname === link.path
              ? "var(--primary-green)"
              : "transparent",
            color: location.pathname === link.path
              ? "var(--white)"
              : "var(--text-dark)",
            fontWeight: location.pathname === link.path ? 600 : 500,
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
            border: location.pathname === link.path
              ? "1px solid var(--primary-green)"
              : "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== link.path) {
              e.currentTarget.style.backgroundColor = "rgba(46, 125, 50, 0.1)";
              e.currentTarget.style.color = "var(--primary-green)";
              e.currentTarget.style.borderColor = "var(--primary-green)";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== link.path) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-dark)";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}
        >
          <span style={{ fontSize: "1rem", display: "flex", alignItems: "center" }}>
            {link.icon}
          </span>
          {link.text}
        </Link>
      ))}
    </Box>
  );
};

export default Navigation;

