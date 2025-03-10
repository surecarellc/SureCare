import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";


const Questionnaire = () => {
  const navigate = useNavigate();
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const goToLaunchPage = () => {
    navigate("/"); // Navigate to the LaunchPage
  };

  const goToResults = () => {
    navigate("/results");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="container d-flex flex-column min-vh-100 justify-content-between align-items-center text-center"
    >
      <div className="row w-100 d-flex justify-content-center align-items-center flex-grow-1 mt-2">
        {/* Title Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center text-center">
          <a
            className="navbar-brand cursor-pointer"
            onClick={goToLaunchPage}
            style={{ fontSize: '2rem', fontWeight: '700', cursor: 'pointer' }}
          >
            <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
              <span style={{ color: "#241A90" }}>Sure</span>
              <span style={{ color: "#3AADA4" }}>Care</span>
            </h1>
          </a>
          <p className="fs-3" style={{ fontWeight: "300" }}>
            Get started today. We can help.
          </p>
        </div>

        {/* Form Card Section */}
        <div className="col-md-8 d-flex justify-content-center">
          <div
            className="card shadow-lg d-flex flex-column mx-auto text-center"
            style={{
              borderRadius: "20px",
              maxHeight: "500px",
              maxWidth: "800px",
              overflow: "hidden",
              width: "100%",
              borderTop: "2px solid black",
              borderBottom: "2px solid black",
              borderLeft: "2px solid black",
              borderRight: "2px solid black",
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
                  <label className="col-form-label col-sm-4">
                    Do you have health insurance?
                  </label>
                  <div className="col-sm-8">
                  <ButtonGroup style={{ gap: "30px" }}> {/* Added gap for spacing between buttons */}
                    <Button
                      className="px-4 py-2 fw-bold"
                      style={{
                        backgroundColor: healthInsurance === "Yes" ? "#241A90" : "transparent",
                        color: healthInsurance === "Yes" ? "#fff" : "#241A90",
                        border: `2px solid ${healthInsurance === "Yes" ? "#241A90" : "#241A90"}`,
                        borderRadius: "25px",
                        boxShadow: healthInsurance === "Yes" ? "0px 4px 10px #241A90" : "none",
                        transition: "all 0.3s ease-in-out"
                      }}
                      onClick={() => setHealthInsurance(healthInsurance === "Yes" ? null : "Yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      className="px-4 py-2 fw-bold"
                      style={{
                        backgroundColor: healthInsurance === "No" ? "#3AADA4" : "transparent",
                        color: healthInsurance === "No" ? "#fff" : "#3AADA4",
                        border: `2px solid ${healthInsurance === "No" ? "#3AADA4" : "#3AADA4"}`,
                        borderRadius: "25px",
                        boxShadow: healthInsurance === "No" ? "0px 4px 10px #3AADA4" : "none",
                        transition: "all 0.3s ease-in-out"
                      }}
                      onClick={() => setHealthInsurance(healthInsurance === "No" ? null : "No")}
                    >
                      No
                    </Button>
                  </ButtonGroup>
                  </div>
                </div>
                <div className="mb-5 row">
                  <label className="col-form-label col-sm-4">Do you prefer in-person or virtual appointment?</label>
                  <div className="col-sm-8">
                  <ButtonGroup style={{ gap: "30px" }}> {/* Added gap for spacing between buttons */}
                    <Button
                      className="px-4 py-2 fw-bold"
                      style={{
                        backgroundColor: appointmentType === "In-person" ? "#241A90" : "transparent",
                        color: appointmentType === "In-person" ? "#fff" : "#241A90",
                        border: `2px solid ${appointmentType === "In-person" ? "#241A90" : "#241A90"}`,
                        borderRadius: "25px",
                        boxShadow: appointmentType === "In-person" ? "0px 4px 10px #241A90" : "none",
                        transition: "all 0.3s ease-in-out"
                      }}
                      onClick={() => setAppointmentType(appointmentType === "In-person" ? null : "In-person")}
                    >
                      In-Person
                    </Button>
                    <Button
                      className="px-4 py-2 fw-bold"
                      style={{
                        backgroundColor: appointmentType === "Virtual" ? "#3AADA4" : "transparent",
                        color: appointmentType === "Virtual" ? "#fff" : "#3AADA4",
                        border: `2px solid ${appointmentType === "Virtual" ? "#3AADA4" : "#3AADA4"}`,
                        borderRadius: "25px",
                        boxShadow: appointmentType === "Virtual" ? "0px 4px 10px #3AADA4" : "none",
                        transition: "all 0.3s ease-in-out"
                      }}
                      onClick={() => setAppointmentType(appointmentType === "Virtual" ? null : "Virtual")}
                    >
                      Virtual
                    </Button>
                  </ButtonGroup>

                  </div>
                </div>
                <div className="mb-5 row">
                  <label className="col-form-label col-sm-4">Select your symptoms</label>
                  <div className="col-sm-5">
                    <select className="form-select">
                      <option>Click to see options</option>
                    </select>
                  </div>
                </div>
                {/* Address Field */}
                <div className="mt-4 row">
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

                {/* Centered, Rounded Submit Button */}
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
                    onClick={goToResults}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark"
        style={{ position: "relative", bottom: 0, left: 0, right: 0, width: "100vw" }}>
        &copy; 2025 SureCare. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Questionnaire;
