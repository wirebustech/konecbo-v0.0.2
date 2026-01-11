import React, { useEffect } from "react";
import Navigation from "./Navigation";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <footer
      style={{
        backgroundColor: "#e6f4ff",
        color: "#1E293B",
        padding: "2rem 1rem",
        marginTop: "3rem",
        borderTop: "2px solid #10b981",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Navigation variant="footer" />
        <Box
          sx={{
            textAlign: "center",
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              fontSize: "0.9rem",
            }}
          >
            ©2025 Konecbo · Connecting Researchers, Accelerating Discovery
          </Typography>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;