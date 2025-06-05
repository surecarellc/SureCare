import React from "react";
import { useNavigation } from "../utils/goToFunctions.js";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { goToLaunchPage, goToAboutPage, goToHelpPage, goToSignInPage } = useNavigation();
  const location = useLocation();

  // Handle navigation with scroll to top if on same page
  const handleNavigation = (path, navigateFunction) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigateFunction();
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-0"
      style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}
    >
      <div className="container-fluid d-flex justify-content-between">
        <button
          onClick={goToLaunchPage}
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: "700",
            cursor: "pointer",
            background: "none",
            border: "none",
          }}
          aria-label="Go to Home Page"
        >
          <span style={{ color: "#241A90" }}>Sure</span>
          <span style={{ color: "#3AADA4" }}>Care</span>
        </button>
        <div className="d-flex">
          <button
            className="nav-link text-dark mx-3 bg-transparent border-0"
            onClick={() => handleNavigation("/about", goToAboutPage)}
            aria-label="Go to About Page"
          >
            About
          </button>
          <button
            className="nav-link text-dark mx-3 bg-transparent border-0"
            onClick={() => handleNavigation("/help", goToHelpPage)}
            aria-label="Go to Help Page"
          >
            Help
          </button>
          <button
            className="nav-link text-dark mx-3 bg-transparent border-0"
            onClick={goToSignInPage}
            aria-label="Go to Sign In Page"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 