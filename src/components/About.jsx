import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/LandingPage.css";
import AboutBackgroundImage from "../assets/about-background-final.png";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    // Check if user arrived via Navbar
    setShowBackButton(location.state?.fromNavbar === true);
  }, [location.state]);

  return (
    <main className="App">
      <section className="home-container">
        <Navbar />
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: "6rem",
              left: "7rem",
              zIndex: 100,
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(46, 125, 50, 0.2)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              color: "#1B5E20",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            &larr; Back
          </button>
        )}

        {/* Hero Section - Matching Home Page Style */}
        <section className="home-banner-container" style={{ paddingTop: "2rem", marginBottom: "3rem", backgroundColor: "#ffffff" }}>
          <article className="home-text-section">
            <header>
              <p style={{ fontSize: "1rem", color: "#FF6B35", fontWeight: 600, marginBottom: "0.5rem" }}>
                About Konecbo
              </p>
              <h1 className="primary-heading">
                Our Story
              </h1>
            </header>
            <p className="primary-text">
              Konecbo was born from a simple observation: groundbreaking research often requires diverse expertise, yet researchers struggle to find the right collaborators beyond their immediate networks. In today's interconnected world, geographical boundaries shouldn't limit scientific progress.
            </p>
            <p className="primary-text" style={{ marginTop: "1rem" }}>
              Founded in 2024 by a team of researchers and technologists who experienced these challenges firsthand, Konecbo was created to break down the barriers that separate brilliant minds working on similar problems across continents.
            </p>
            <nav style={{ marginTop: "2rem" }}>
              <Link to="/learn-more" className="secondary-button">
                Learn More <FiArrowRight />
              </Link>
            </nav>
          </article>
          <figure className="home-image-section" style={{ marginLeft: "2rem" }}>
            <img src={AboutBackgroundImage} alt="Collaboration in Action" />
          </figure>
        </section>

        {/* Content Sections - Matching Home Page Style */}
        <section className="platform-overview" style={{ padding: "4rem 2rem", backgroundColor: "#F1F8F4" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Mission & Vision Cards */}
            <section style={{ marginBottom: "3rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>Our Mission</h2>
                  <p style={{ fontSize: "1rem", color: "#424242", lineHeight: "1.8" }}>
                    To democratize research collaboration by creating a global platform where researchers from all backgrounds, institutions, and locations can connect, collaborate, and accelerate scientific discovery.
                  </p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>Our Vision</h2>
                  <p style={{ fontSize: "1rem", color: "#424242", lineHeight: "1.8" }}>
                    We envision a world where every researcher has access to the perfect collaborator, where institutional prestige matters less than expertise and dedication, and where the best ideas flourish through diverse, international partnerships.
                  </p>
                </div>
              </div>
            </section>

            {/* What Makes Us Different */}
            <section style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>What Makes Konecbo Different</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>
                    <strong style={{ color: "#FF6B35" }}>Open to All Researchers</strong>
                  </h4>
                  <p style={{ color: "#424242" }}>From graduate students to established professors, independent researchers to institutional teams - if you're passionate about research, you belong here.</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>
                    <strong style={{ color: "#FF6B35" }}>Discipline-Agnostic</strong>
                  </h4>
                  <p style={{ color: "#424242" }}>Whether you're in molecular biology, computer science, social sciences, or any other field, Konecbo connects researchers across all domains of knowledge.</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>
                    <strong style={{ color: "#FF6B35" }}>Global Reach, Local Impact</strong>
                  </h4>
                  <p style={{ color: "#424242" }}>Connect with researchers worldwide while maintaining the personal touch that makes collaboration meaningful.</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>
                    <strong style={{ color: "#FF6B35" }}>Quality Over Quantity</strong>
                  </h4>
                  <p style={{ color: "#424242" }}>Our star system ensures that researchers who consistently contribute quality work and reliable collaboration are recognized and trusted.</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>
                    <strong style={{ color: "#FF6B35" }}>Privacy-Focused</strong>
                  </h4>
                  <p style={{ color: "#424242" }}>Your research ideas are protected. Share only what you're comfortable sharing, when you're ready to share it.</p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>Our Values</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <strong style={{ color: "#FF6B35", display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Integrity</strong>
                  <span style={{ color: "#424242" }}>We maintain the highest ethical standards in research collaboration</span>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <strong style={{ color: "#FF6B35", display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Inclusivity</strong>
                  <span style={{ color: "#424242" }}>Every researcher deserves access to collaboration opportunities</span>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <strong style={{ color: "#FF6B35", display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Innovation</strong>
                  <span style={{ color: "#424242" }}>We continuously improve our platform to serve the research community better</span>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <strong style={{ color: "#FF6B35", display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Transparency</strong>
                  <span style={{ color: "#424242" }}>Clear communication and honest representation of capabilities</span>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <strong style={{ color: "#FF6B35", display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Community</strong>
                  <span style={{ color: "#424242" }}>Building a supportive global network of researchers helping researchers</span>
                </div>
              </div>
            </section>

            {/* The Team - Matching "By The Numbers" Style */}
            <section style={{ backgroundColor: "#1B5E20", color: "#FFFFFF", padding: "3rem 2rem", borderRadius: "8px", textAlign: "center", borderTop: "4px solid #FF6B35" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>The Team</h2>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto" }}>
                Konecbo is built and maintained by a diverse team of researchers, software engineers, data scientists, and community managers who understand the challenges of modern research collaboration. Our advisory board includes leading researchers from major institutions worldwide who guide our development and ensure we're serving the real needs of the research community.
              </p>
            </section>
          </div>
        </section>

        <Footer />
      </section>
    </main>
  );
};

export default About;
