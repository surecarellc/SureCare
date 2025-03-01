import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import googleImage from "./components/google.png";

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
    >
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-4 shadow-lg" 
        style={{ width: "500px" }}
      >
        <div className="text-center mb-3">
          <h1 className="fw-bold">
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </h1>
        </div>
        <button className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center">
          <img
            src={googleImage}
            alt="Google Logo"
            width="20"
            className="me-2"
          />
          <span>Sign in with Google</span>
        </button>
        <hr />
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign In</button>
        </form>
        <div className="text-center mt-2">
          <a href="#" className="text-decoration-none">Forgot password?</a>
        </div>
        <div className="text-center mt-3">
          <button onClick={() => navigate("/signup")} className="btn btn-outline-dark">Sign Up</button>
        </div>
        <footer className="text-center mt-4 text-muted">
          &copy; 2025 SureCare. All rights reserved.
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;
