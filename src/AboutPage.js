import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./utils/goToFunctions.js";
import { Button, ButtonGroup, InputGroup, FormControl, Dropdown, Badge } from "react-bootstrap";

const Questionnaire = () => {
  const { goToAboutPage, goToHelpPage, goToSignInPage, goToLaunchPage, goToResultsPage } = useNavigation();

  // State variables for form fields
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSymptomsDropdown, setShowSymptomsDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Refs for the input and dropdown
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Custom hook to handle clicks outside multiple refs
  const useOnClickOutsideMultiple = (refs, handler) => {
    useEffect(() => {
      const listener = (event) => {
        // Check if the click is outside all refs
        if (refs.every((ref) => !ref.current || !ref.current.contains(event.target))) {
          handler(event);
        }
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [refs, handler]);
  };

  // Use the custom hook to close the dropdown when clicking outside
  useOnClickOutsideMultiple([inputRef, dropdownRef], () => {
    setShowSymptomsDropdown(false);
  });

  // Comprehensive, alphabetically sorted list of symptoms
  const symptomOptions = [
    "Abdominal pain", "Acne", "Acute pain", "ADHD", "Adrenal disorders", "Alcoholism",
    "Allergies", "Alzheimer's disease", "Anemia", "Angina", "Ankle pain", "Anorexia",
    // ... (rest of the symptoms remain unchanged)
  ];

  // Form validation
  const isFormValid = () => {
    const isPriceRangeValid =
      (priceMin === "" && priceMax === "") ||
      (priceMin !== "" && priceMax !== "" && parseFloat(priceMin) < parseFloat(priceMax));

    return (
      healthInsurance !== null &&
      appointmentType !== null &&
      symptoms.length > 0 &&
      location.trim() !== "" &&
      radius !== "" &&
      isPriceRangeValid
    );
  };

  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSubmit = () => {
    if (isFormValid()) {
      goToResultsPage();
    } else {
      setSubmitted(true);
    }
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

  // Handle input change and dropdown visibility
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setHighlightedIndex(-1);
    setShowSymptomsDropdown(true);
  };

  // Filter symptoms, excluding already selected ones
  const filteredSymptoms = symptomOptions
    .filter((symptom) => !symptoms.includes(symptom))
    .filter((symptom) => symptom.toLowerCase().includes(inputValue.toLowerCase()));

  // Handle symptom selection
  const handleSymptomSelect = (symptom) => {
    setSymptoms([...symptoms, symptom]);
    setInputValue("");
    setHighlightedIndex(-1);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Remove a symptom
  const handleRemoveSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove));
  };

  // Handle keyboard navigation for symptoms
  const handleKeyDownSymptoms = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredSymptoms.length > 0) {
        setShowSymptomsDropdown(true);
        setHighlightedIndex((prev) =>
          prev < filteredSymptoms.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredSymptoms.length > 0) {
        setShowSymptomsDropdown(true);
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSymptomSelect(filteredSymptoms[highlightedIndex]);
      } else if (inputValue !== "" && filteredSymptoms.length > 0) {
        handleSymptomSelect(filteredSymptoms[0]);
      }
    } else if (e.key === "Escape") {
      setShowSymptomsDropdown(false);
      setHighlightedIndex(-1);
    }
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
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToSignInPage}>
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
                  {/* Symptoms */}
                  <div className="mb-5 row align-items-center position-relative">
                    <label className="col-form-label col-sm-4" style={{ fontWeight: 700 }}>
                      Select your symptoms
                    </label>
                    <div className="col-sm-8 position-relative">
                      <div
                        className={`form-control d-flex flex-wrap align-items-center p-2 ${
                          submitted && symptoms.length === 0 ? "is-invalid" : ""
                        }`}
                        style={{ minHeight: "38px" }}
                      >
                        {symptoms.map((symptom, index) => (
                          <Badge
                            key={index}
                            pill
                            bg="secondary"
                            className="d-flex align-items-center me-2 mb-1"
                          >
                            {symptom}
                            <span
                              className="ms-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemoveSymptom(symptom)}
                            >
                              ×
                            </span>
                          </Badge>
                        ))}
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          onFocus={() => setShowSymptomsDropdown(true)}
                          onKeyDown={handleKeyDownSymptoms}
                          placeholder={symptoms.length === 0 ? "Type your symptoms..." : ""}
                          style={{
                            border: "none",
                            outline: "none",
                            flex: 1,
                            minWidth: "100px",
                            background: "transparent",
                          }}
                        />
                      </div>
                      {showSymptomsDropdown && filteredSymptoms.length > 0 && (
                        <div ref={dropdownRef}>
                          <Dropdown.Menu
                            show
                            className="w-100"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {filteredSymptoms.map((symptom, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() => handleSymptomSelect(symptom)}
                                active={index === highlightedIndex}
                              >
                                {symptom}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </div>
                      )}
                      {submitted && symptoms.length === 0 && (
                        <div
                          className="invalid-feedback d-block position-absolute"
                          style={{ bottom: "-1.5em", left: 0, width: "100%", color: "red" }}
                        >
                          Please select at least one symptom.
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