/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';



const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const menuOptions = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "About", icon: <InfoIcon />, path: "/about" },
    { text: "Learn More", icon: <SchoolIcon />, path: "/learn-more" },
    { text: "Sign Up", icon: <PersonAddIcon />, path: "/signup" },
    { text: "Log In", icon: <LoginIcon />, path: "/signin" },
  ];

  const isActive = (path) => location.pathname === path;

  const mainNavItems = menuOptions.slice(0, 3); // Home, About, Learn More

  return (
    <nav
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid rgba(46, 125, 50, 0.12)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 1px 3px rgba(27, 94, 32, 0.05)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: { xs: "1rem 1.5rem", md: "1.25rem 2.5rem" },
          gap: { xs: "1rem", md: "2rem" },
        }}
      >
        {/* Logo/Brand Section */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            gap: "0.75rem",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <img
            src="/logo.png"
            alt="Konecbo Logo"
            style={{
              //width: 42,
              //height: 42,
              width: 120,
              height: 40,
              //borderRadius: "50%",
              //border: "2px solid #FF6B35",
              //objectFit: "cover",
            }}
          />
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#1B5E20",
              letterSpacing: "-0.03em",
              lineHeight: "1",
            }}
          >

          </span>
        </Link>

        {/* Main Navigation - Desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "0.25rem",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              state={{ fromNavbar: true }}
              style={{
                textDecoration: "none",
                color: isActive(item.path) ? "#1B5E20" : "#424242",
                fontSize: "0.9rem",
                fontWeight: isActive(item.path) ? 600 : 500,
                padding: "0.625rem 1.25rem",
                borderRadius: "6px",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.color = "#1B5E20";
                  e.currentTarget.style.backgroundColor = "rgba(46, 125, 50, 0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.color = "#424242";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {isActive(item.path) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60%",
                    height: "2px",
                    backgroundColor: "#FF6B35",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
              {item.text}
            </Link>
          ))}
        </Box>

        {/* Auth Buttons - Desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Link
            to="/signup"
            state={{ fromNavbar: true }}
            style={{
              textDecoration: "none",
              color: "#1B5E20",
              fontSize: "0.9rem",
              fontWeight: 500,
              padding: "0.625rem 1.25rem",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              border: "1px solid rgba(46, 125, 50, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(46, 125, 50, 0.08)";
              e.currentTarget.style.borderColor = "rgba(46, 125, 50, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(46, 125, 50, 0.2)";
            }}
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            state={{ fromNavbar: true }}
            style={{
              textDecoration: "none",
              color: "#FFFFFF",
              fontSize: "0.9rem",
              fontWeight: 600,
              padding: "0.625rem 1.5rem",
              borderRadius: "6px",
              backgroundColor: "#1B5E20",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(27, 94, 32, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2E7D32";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(27, 94, 32, 0.25)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1B5E20";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(27, 94, 32, 0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Log In
          </Link>
        </Box>

        {/* Mobile Menu Button */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "6px",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(46, 125, 50, 0.08)",
            },
          }}
          onClick={() => setOpenMenu(true)}
        >
          <HiOutlineBars3 style={{ fontSize: "1.5rem", color: "#1B5E20" }} />
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        anchor="right"
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          {/* Mobile Header */}
          <Box
            sx={{
              padding: "2rem 1.5rem 1.5rem",
              borderBottom: "1px solid rgba(46, 125, 50, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <img
              src="/logo.png"
              alt="Konecbo Logo"
              style={{
                width: 90,
                height: 40,
                //borderRadius: "50%",
                //border: "2px solid #FF6B35",
                //objectFit: "cover",
              }}
            />
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#1B5E20",
                letterSpacing: "-0.02em",
              }}
            >

            </div>
          </Box>

          {/* Main Navigation Items */}
          <List sx={{ paddingTop: "0.5rem" }}>
            {mainNavItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path) ? "#1B5E20" : "#424242",
                    fontWeight: isActive(item.path) ? 600 : 500,
                    backgroundColor: isActive(item.path)
                      ? "rgba(46, 125, 50, 0.08)"
                      : "transparent",
                    borderLeft: isActive(item.path) ? "3px solid #FF6B35" : "3px solid transparent",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.06)",
                    },
                    padding: "0.875rem 1.5rem",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? "#FF6B35" : "#424242",
                      minWidth: "40px",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ margin: "0.5rem 0" }} />

          {/* Auth Buttons */}
          <Box sx={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              to="/signup"
              state={{ fromNavbar: true }}
              style={{
                textDecoration: "none",
                color: "#1B5E20",
                fontSize: "0.9rem",
                fontWeight: 500,
                padding: "0.75rem 1.25rem",
                borderRadius: "6px",
                border: "1px solid rgba(46, 125, 50, 0.3)",
                textAlign: "center",
                transition: "all 0.2s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(46, 125, 50, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              state={{ fromNavbar: true }}
              style={{
                textDecoration: "none",
                color: "#FFFFFF",
                fontSize: "0.9rem",
                fontWeight: 600,
                padding: "0.75rem 1.25rem",
                borderRadius: "6px",
                backgroundColor: "#1B5E20",
                textAlign: "center",
                transition: "all 0.2s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2E7D32";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B5E20";
              }}
            >
              Log In
            </Link>
          </Box>
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
