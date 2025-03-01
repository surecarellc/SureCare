import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AboutPage = () => {
  const navigate = useNavigate();

  const goToLaunchPage = () => {
    navigate("/"); // Navigate to the LaunchPage
  };

  const goToSignIn = () => {
    navigate("/signin");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}  // Slide in from right
      animate={{ opacity: 1, x: 0 }}  // Animate in
      exit={{ opacity: 0, x: -100 }}  // Animate out
      transition={{ duration: 0.5 }}
      className="d-flex flex-column min-vh-100 align-items-center text-center p-4"
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm w-100 border-bottom border-dark" style={{ padding: "1rem 2rem" }}>
        <div className="container-fluid d-flex justify-content-between">
          <a className="navbar-brand" href="#" style={{ fontSize: '2rem', fontWeight: '700' }}>
            <span style={{ color: '#241A90' }}>Sure</span>
            <span style={{ color: '#3AADA4' }}>Care</span>
          </a>
          <div className="d-flex">
            <button 
              className="nav-link text-dark mx-3 bg-transparent border-0" 
              onClick={goToLaunchPage}
            >
              Home
            </button>
            <a href="#" className="nav-link text-dark mx-3">Help</a>
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* About Section */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-fill d-flex flex-column justify-content-center align-items-center w-75 p-5 text-black"
      >
        <h1 className="display-4 font-weight-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Who We Are
        </h1>
        <p className="lead" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '300', maxWidth: '800px' }}>
          SureCare is a healthcare technology company dedicated to bringing transparency, affordability, and accessibility to medical services in the United States. We believe that every American deserves to know the real cost of healthcare before stepping into a doctor’s office or hospital. Our mission is to empower consumers with accurate pricing, provider quality insights, and expert guidance to help them make informed medical decisions.
        </p>

        <h2 className="display-5 font-weight-bold mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Our Mission
        </h2>
        <p className="lead" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '300', maxWidth: '800px' }}>
          SureCare is revolutionizing the healthcare industry by providing a simple, user-friendly platform that enables individuals to compare real-time medical pricing, access high-quality providers, and receive on-demand medical guidance. By offering cost transparency, telehealth access, and top-rated provider recommendations, we aim to make healthcare more accessible and affordable for all. Whether you are uninsured, underinsured, or simply seeking better options, SureCare is your trusted resource for smarter healthcare decisions.
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="text-center p-4 text-muted bg-white shadow-sm w-100 border-top border-dark">
        &copy; 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default AboutPage;
