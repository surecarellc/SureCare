import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, InputGroup, FormControl } from "react-bootstrap";

const Questionnaire = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [careType, setCareType] = useState("");
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Navigation handlers
  const goToLaunchPage = () => navigate("/");
  const goToResults = () => navigate("/results");
  const goToAboutPage = () => navigate("/about");
  const goToHelpPage = () => navigate("/help");
  const goToSignIn = () => navigate("/signin");

  // Form validation
  const isFormValid = () => {
    // Price range is valid if both are empty OR both are filled and min < max
    const isPriceRangeValid =
      (priceMin === "" && priceMax === "") ||
      (priceMin !== "" && priceMax !== "" && parseFloat(priceMin) < parseFloat(priceMax));

    // Check all other required fields and the price range condition
    return (
      careType !== "" &&
      healthInsurance !== null &&
      appointmentType !== null &&
      symptoms !== "" &&
      location.trim() !== "" &&
      radius !== "" &&
      isPriceRangeValid
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) goToResults();
    else setSubmitted(true);
  };

  // Price input handling
  const handlePriceInput = (value, setter) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || parseInt(numericValue) >= 0) setter(numericValue);
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"
    ];
    if (!allowedKeys.includes(e.key)) e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="d-flex flex-column min-vh-100"
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-0"
        style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}
      >
        <div className="container-fluid d-flex justify-content-between">
        <button 
            onClick={goToLaunchPage}
            style={{ fontSize: "2rem", fontWeight: "700", cursor: "pointer", background: "none", border: "none" }}
          >
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </button>
          
          <div className="d-flex">
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToAboutPage}>
              About
            </button>
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToHelpPage}>
              Help
            </button>
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container flex-fill d-flex flex-column justify-content-center align-items-center text-center pt-5">
        <div className="row w-100 d-flex justify-content-center align-items-center mt-5 mb-2">
          {/* Title Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center text-center">
            <p className="fs-2" style={{ fontWeight: "400" }}>
              Get started today. We can help.
            </p>
          </div>

          {/* Form Card Section */}
          <div className="col-md-8 d-flex justify-content-center mb-5">
            <div
              className="card shadow-lg d-flex flex-column mx-auto text-center"
              style={{
                borderRadius: "20px",
                maxHeight: "900px",
                maxWidth: "1000px",
                overflow: "hidden",
                width: "100%",
                border: "2px solid gray",
              }}
            >
              <div
                className="card-body p-4 d-flex flex-column"
                style={{ overflowY: "auto", flex: 1 }}
              >
                <form className="d-flex flex-column">
                  {/* Type of Care */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      What type of care are you seeking?
                    </label>
                    <div className="col-sm-8 position-relative">
                      <select
                        className={`form-select ${submitted && careType === "" ? "is-invalid" : ""}`}
                        value={careType}
                        onChange={(e) => setCareType(e.target.value)}
                      >
                        <option value="">Click to see options</option>
                        <option value="primary">Primary Care</option>
                        <option value="specialist">Specialist</option>
                      </select>
                      {submitted && careType === "" && (
                        <div
                          className="invalid-feedback d-block position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%", color: "red" }}
                        >
                          Please select a care type.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Health Insurance */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      Do you have health insurance?
                    </label>
                    <div className="col-sm-8 position-relative">
                      <ButtonGroup className="d-flex justify-content-start" style={{ gap: "20px" }}>
                        <Button
                          className="fw-bold"
                          style={{
                            width: "120px",
                            padding: "10px 20px",
                            backgroundColor: healthInsurance === "Yes" ? "#241A90" : "transparent",
                            color: healthInsurance === "Yes" ? "#fff" : "#241A90",
                            border: "2px solid #241A90",
                            borderRadius: "25px",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() => setHealthInsurance(healthInsurance === "Yes" ? null : "Yes")}
                        >
                          Yes
                        </Button>
                        <Button
                          className="fw-bold"
                          style={{
                            width: "120px",
                            padding: "10px 20px",
                            backgroundColor: healthInsurance === "No" ? "#3AADA4" : "transparent",
                            color: healthInsurance === "No" ? "#fff" : "#3AADA4",
                            border: "2px solid #3AADA4",
                            borderRadius: "25px",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() => setHealthInsurance(healthInsurance === "No" ? null : "No")}
                        >
                          No
                        </Button>
                      </ButtonGroup>
                      {submitted && healthInsurance === null && (
                        <div
                          className="text-danger position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%" }}
                        >
                          Please select an option.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      Do you prefer in-person or virtual appointment?
                    </label>
                    <div className="col-sm-8 position-relative">
                      <ButtonGroup className="d-flex justify-content-start" style={{ gap: "20px" }}>
                        <Button
                          className="fw-bold"
                          style={{
                            width: "80px",
                            padding: "10px 10px",
                            backgroundColor: appointmentType === "In-person" ? "#241A90" : "transparent",
                            color: appointmentType === "In-person" ? "#fff" : "#241A90",
                            border: "2px solid #241A90",
                            borderRadius: "25px",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() =>
                            setAppointmentType(appointmentType === "In-person" ? null : "In-person")
                          }
                        >
                          In-Person
                        </Button>
                        <Button
                          className="fw-bold"
                          style={{
                            width: "80px",
                            padding: "10px 10px",
                            backgroundColor: appointmentType === "Virtual" ? "#3AADA4" : "transparent",
                            color: appointmentType === "Virtual" ? "#fff" : "#3AADA4",
                            border: "2px solid #3AADA4",
                            borderRadius: "25px",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() =>
                            setAppointmentType(appointmentType === "Virtual" ? null : "Virtual")
                          }
                        >
                          Virtual
                        </Button>
                        <Button
                          className="fw-bold"
                          style={{
                            width: "80px",
                            padding: "10px 10px",
                            backgroundColor: appointmentType === "Both" ? "#6c757d" : "transparent",
                            color: appointmentType === "Both" ? "#fff" : "#6c757d",
                            border: "2px solid #6c757d",
                            borderRadius: "25px",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() =>
                            setAppointmentType(appointmentType === "Both" ? null : "Both")
                          }
                        >
                          No Preference
                        </Button>
                      </ButtonGroup>
                      {submitted && appointmentType === null && (
                        <div
                          className="text-danger position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%" }}
                        >
                          Please select an option.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      Select your symptoms
                    </label>
                    <div className="col-sm-8 position-relative">
                      <select
                        className={`form-select ${submitted && symptoms === "" ? "is-invalid" : ""}`}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                      >
                        <option value="">Click to see options</option>
                        <option value="fever">Fever</option>
                        <option value="cough">Cough</option>
                      </select>
                      {submitted && symptoms === "" && (
                        <div
                          className="invalid-feedback d-block position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%", color: "red" }}
                        >
                          Please select your symptoms.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferred Location and Radius */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      What is your preferred location?
                    </label>
                    <div className="col-sm-5 position-relative">
                      <input
                        type="text"
                        className={`form-control ${submitted && location.trim() === "" ? "is-invalid" : ""}`}
                        placeholder="Enter your address"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      {submitted && location.trim() === "" && (
                        <div
                          className="invalid-feedback d-block position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%", color: "red" }}
                        >
                          Please enter your location.
                        </div>
                      )}
                    </div>
                    <div className="col-sm-3 position-relative">
                      <InputGroup>
                        <FormControl
                          as="select"
                          value={radius}
                          onChange={(e) => setRadius(e.target.value)}
                          className={submitted && radius === "" ? "is-invalid" : ""}
                          style={{
                            borderRight: "none",
                            appearance: "auto",
                            paddingRight: "1.5rem"
                          }}
                        >
                          <option value="">Radius</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </FormControl>
                        <InputGroup.Text style={{ backgroundColor: "#fff", borderLeft: "none" }}>
                          mi
                        </InputGroup.Text>
                      </InputGroup>
                      {submitted && radius === "" && (
                        <div
                          className="invalid-feedback d-block position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%", color: "red" }}
                        >
                          Please select your radius.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desired Price Range */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      Desired Price Range
                    </label>
                    <div className="col-sm-4 position-relative">
                      <InputGroup>
                        <InputGroup.Text style={{ backgroundColor: "#fff", borderRight: "none" }}>
                          $
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          placeholder="Min"
                          style={{ borderLeft: "none" }}
                          value={priceMin}
                          onChange={(e) => handlePriceInput(e.target.value, setPriceMin)}
                          onKeyDown={handleKeyDown}
                          min="0"
                          step="1"
                          className={
                            submitted &&
                            priceMin !== "" &&
                            priceMax !== "" &&
                            parseFloat(priceMin) >= parseFloat(priceMax)
                              ? "is-invalid"
                              : ""
                          }
                        />
                      </InputGroup>
                      {submitted &&
                        priceMin !== "" &&
                        priceMax !== "" &&
                        parseFloat(priceMin) >= parseFloat(priceMax) && (
                          <div
                            className="invalid-feedback d-block position-absolute"
                            style={{ bottom: "-1.5em", left: 0, width: "100%", color: "red" }}
                          >
                            Min must be less than max.
                          </div>
                        )}
                    </div>
                    <div className="col-sm-4 position-relative">
                      <InputGroup>
                        <InputGroup.Text style={{ backgroundColor: "#fff", borderRight: "none" }}>
                          $
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          placeholder="Max"
                          style={{ borderLeft: "none" }}
                          value={priceMax}
                          onChange={(e) => handlePriceInput(e.target.value, setPriceMax)}
                          onKeyDown={handleKeyDown}
                          min="0"
                          step="1"
                          className={
                            submitted &&
                            priceMin !== "" &&
                            priceMax !== "" &&
                            parseFloat(priceMin) >= parseFloat(priceMax)
                              ? "is-invalid"
                              : ""
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-1 d-flex justify-content-center">
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
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
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
        style={{ position: "relative", bottom: 0, left: 0, right: 0, width: "100vw" }}
      >
        © 2025 SureCare. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Questionnaire;