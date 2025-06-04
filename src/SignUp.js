import React from "react";
import { motion } from "framer-motion";
import googleImage from "./components/google.png";
import {useNavigation} from "./utils/goToFunctions.js";

const SignUp = () => {
  const { goToSignInPage, goToLaunchPage} = useNavigation();


  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ flexDirection: 'column' }} // Ensure vertical stacking
    >
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-4 shadow-lg" 
        style={{ width: "500px" }}
      >
        <div className="text-center mb-3">
        <button 
            onClick={goToLaunchPage}
            style={{ fontSize: "2rem", fontWeight: "700", cursor: "pointer", background: "none", border: "none" }}
          >
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </button>
        </div>
        <button className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center">
          <img
            src={googleImage}
            alt="Google Logo"
            width="20"
            className="me-2"
          />
          <span>Sign up with Google</span>
        </button>
        <hr />
        <form>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" placeholder="Enter your full name" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Create a password" />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <button onClick = {goToSignInPage} style={{cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }} >Sign In</button>
        </div>
        <footer className="text-center mt-4 text-muted">
          © 2025 SureCare. All rights reserved.
        </footer>
      </motion.div>
      
    </motion.div>
  );
};

export default SignUp;