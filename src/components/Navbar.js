import React from "react";
import { useNavigation } from "../utils/goToFunctions.js";
import { useLocation } from "react-router-dom";
import fullLogo from "../components/full_logo1.png"; // Adjust path if needed

const Navbar = () => {
  const { goToLaunchPage, goToAboutPage, goToHelpPage, goToSignInPage } = useNavigation();
  const location = useLocation();

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
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
          aria-label="Go to Home Page"
        >
          <img
            src={fullLogo}
            alt="SureCare Logo"
            style={{
              maxHeight: "40px",      // Keeps navbar height controlled
              height: "100%",
              width: "auto",          // Maintain aspect ratio
              objectFit: "contain",
              transform: "scale(1.2)", // Visually enlarges the image
              transformOrigin: "left center" // Keeps scaling from pushing it downward
            }}
          />


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
