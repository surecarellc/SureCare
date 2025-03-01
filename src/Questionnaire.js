import React from "react";
import { motion } from "framer-motion";

const Questionnaire = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="container d-flex flex-column min-vh-100 justify-content-between text-center"
    >
      <div className="row w-100 d-flex align-items-center flex-grow-1">
        <div className="col-md-6 d-flex flex-column justify-content-center text-center">
          <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </h1>
          <p className="fs-3" style={{ fontWeight: "300" }}>
            Get started today. We can help.
          </p>
        </div>
        <div className="col-md-6">
          <div
            className="card shadow-lg d-flex flex-column"
            style={{
              borderRadius: "20px",
              maxHeight: "400px",
              overflow: "hidden",
            }}
          >
            <div
              className="card-body p-4 d-flex flex-column"
              style={{
                overflowY: "auto",
                flex: 1,
              }}
            >
              <form className="d-flex flex-column">
                <div className="mb-5 row">
                  <label className="col-form-label col-sm-4">What type of care are you seeking?</label>
                  <div className="col-sm-8">
                    <select className="form-select">
                      <option>Click to see options</option>
                    </select>
                  </div>
                </div>
                <div className="mb-5 row">
                  <label className="col-form-label col-sm-4">Do you have health insurance?</label>
                  <div className="col-sm-8">
                    <select className="form-select">
                      <option>Click to see options</option>
                    </select>
                  </div>
                </div>
                <div className="mb-5 row">
                  <label className="col-form-label col-sm-4">Do you prefer in-person or virtual appointment?</label>
                  <div className="col-sm-8">
                    <select className="form-select">
                      <option>Click to see options</option>
                    </select>
                  </div>
                </div>
                <div className="mb-5 row">
                  <label className="col-form-label col-sm-4">Select your symptoms</label>
                  <div className="col-sm-8">
                    <select className="form-select">
                      <option>Click to see options</option>
                    </select>
                  </div>
                </div>
                {/* Address Field */}
                <div className="mt-5 row">
                  <label className="col-form-label col-sm-4">What is your preferred location?</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
                {/* New Desired Price Range Field */}
                <div className="mt-5 row">
                  <label className="col-form-label col-sm-4">Desired Price Range</label>
                  <div className="col-sm-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                    />
                  </div>
                  <div className="col-sm-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Centered, Rounder Submit Button */}
                <div className="mt-5 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-dark px-4 py-2"
                    style={{
                      backgroundColor: "#343a40",
                      border: "none",
                      borderRadius: "30px",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#6c757d")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#343a40")}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center p-4 text-muted bg-white shadow-sm w-100 border-top border-dark">
        &copy; 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default Questionnaire;
