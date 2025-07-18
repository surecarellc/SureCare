import React, { useEffect, useState } from "react";
import { useNavigation } from "../utils/goToFunctions.js";
import { useLocation } from "react-router-dom";
import fullLogo from "../components/full_logo1.png";

const Navbar = ({ user: propUser, onLogout }) => {
  const { goToLaunchPage, goToAboutPage, goToHelpPage, goToSignInPage } = useNavigation();
  const location = useLocation();
  const [user, setUser] = useState(propUser);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("surecare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);

  const handleNavigation = (path, navigateFunction) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigateFunction();
    }
  };

  // Safely get name and picture from user, accommodating your payload format
  const userName = user?.name || (user?.profile && user.profile.name) || "User";
  const userPicture = user?.picture || (user?.profile && user.profile.picture);

  // Update localStorage when propUser changes
  useEffect(() => {
    if (propUser) {
      localStorage.setItem("surecare_user", JSON.stringify(propUser));
      setUser(propUser);
    }
  }, [propUser]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("surecare_user");
    setUser(null);
    if (onLogout) onLogout();
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
              maxHeight: "40px",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              transform: "scale(1.2)",
              transformOrigin: "left center",
            }}
          />
        </button>
        <div className="d-flex align-items-center">
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
          {user ? (
            <div className="d-flex align-items-center">
              {userPicture && (
                <img
                  src={userPicture}
                  alt="Profile"
                  style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                />
              )}
              <span className="nav-link text-dark mx-3">Welcome, {userName}</span>
              <button
                className="nav-link text-dark mx-3 bg-transparent border-0"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToSignInPage}
              aria-label="Go to Sign In Page"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;