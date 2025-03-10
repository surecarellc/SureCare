import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HelpPage = () => {
  const navigate = useNavigate();

  const goToLaunchPage = () => {
    navigate("/");
  };

  const goToSignIn = () => {
    navigate("/signin");
  };

  const goToAboutPage = () => {
    navigate("/about");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="d-flex flex-column min-vh-100 align-items-center text-center p-4"
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-0" 
     style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}>
        <div className="container-fluid d-flex justify-content-between">
          <a 
            className="navbar-brand cursor-pointer" 
            onClick={goToLaunchPage} 
            style={{ fontSize: '2rem', fontWeight: '700', cursor: 'pointer' }}>
            <span style={{ color: '#241A90' }}>Sure</span>
            <span style={{ color: '#3AADA4' }}>Care</span>
          </a>
          <div className="d-flex">
            <button 
              className="nav-link text-dark mx-3 bg-transparent border-0" 
              onClick={goToAboutPage}
            >
              About
            </button>
            <button 
              className="nav-link text-dark mx-3 bg-transparent border-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Help
            </button>
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Help Section */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-fill d-flex flex-column justify-content-center align-items-center w-75 p-5 text-black"
      >
        <h1 className="display-4 font-weight-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
          How We Help
        </h1>
        <p className="lead" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '300', maxWidth: '800px' }}>
          At SureCare, we are committed to helping you navigate your options with confidence and clarity. 
          Our mission is to provide price transparency, empowering consumers like you to make informed 
          decisions without the guesswork. Whether you have questions, need assistance, or just want to 
          learn more, we are here to support you every step of the way.
        </p>

        <h2 className="display-5 font-weight-bold mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Contact Us
        </h2>
        <p className="lead" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '300', maxWidth: '800px' }}>
          For any inquiries or support, feel free to reach out to us at
          <a href="mailto:surecare.contact@gmail.com" className="text-lightblue" style={{ textDecoration: 'none' }}> surecare.contact@gmail.com</a>
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark px-0"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw" }}>
        &copy; 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default HelpPage;
