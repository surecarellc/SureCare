import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./utils/goToFunctions";
import fullLogo from "./components/full_logo1.png";

const SignUp = () => {
  const { goToSignInPage, goToLaunchPage } = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "598536059411-3os2eiu1q13linv52nvpbsvtl2jgnka0.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);
    console.log("Google Payload:", payload);
  };

  const handleLogout = () => {
    setUser(null);
    window.google.accounts.id.disableAutoSelect();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ flexDirection: "column" }}
    >
      <motion.div className="card p-4 shadow-lg" style={{ width: "500px" }}>
        <div className="text-center mb-4">
          <button
            onClick={goToLaunchPage}
            style={{ background: "none", border: "none" }}
          >
            <img
              src={fullLogo}
              alt="SureCare Logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </button>
        </div>

        {user ? (
          <div className="text-center">
            <h3>Welcome, {user.name}!</h3>
            <p>Email: {user.email}</p>
            <img
              src={user.picture}
              alt="Profile"
              style={{ width: "80px", borderRadius: "50%" }}
            />
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 mt-3"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div id="google-button" className="w-100 mb-3"></div>
            <hr />
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <button
                onClick={goToSignInPage}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </div>
          </>
        )}
        <footer className="text-center mt-4 text-muted">
          © 2025 SureCare. All rights reserved.
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;
