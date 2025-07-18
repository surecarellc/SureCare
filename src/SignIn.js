import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./utils/goToFunctions";
import fullLogo from "./components/full_logo1.png";

const SignIn = () => {
  const { goToLaunchPage } = useNavigation();

  useEffect(() => {
    const handleCredentialResponse = (response) => {
      try {
        const token = response.credential;
        const payload = JSON.parse(atob(token.split(".")[1]));
        localStorage.setItem("surecare_user", JSON.stringify(payload));
        console.log("Google User:", payload);

        goToLaunchPage();
      } catch (error) {
        console.error("Failed to parse Google token:", error);
      }
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "598536059411-3os2eiu1q13linv52nvpbsvtl2jgnka0.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "filled_blue",
          size: "large",
          width: "100%",
          type: "standard",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "left",
        }
      );
    }
  }, [goToLaunchPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ flexDirection: "column", padding: "1rem" }}
    >
      <motion.div
        className="card shadow-lg p-5"
        style={{ maxWidth: 420, width: "100%", borderRadius: "20px" }}
      >
        <div className="text-center mb-4">
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
              style={{ height: 70, objectFit: "contain" }}
            />
          </button>
        </div>
        <div id="google-signin-button" className="mb-3"></div>
        <p
          className="text-center mt-3"
          style={{ color: "#555", fontSize: 14, userSelect: "none" }}
        >
          By signing in, you agree to our{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;