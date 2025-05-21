import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./utils/goToFunctions.js";
import { Button, ButtonGroup, InputGroup, FormControl, Dropdown, Badge } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";

const Questionnaire = () => {
  const { goToAboutPage, goToHelpPage, goToSignInPage, goToLaunchPage, goToResultsPage } = useNavigation();

  // State variables for form fields
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSymptomsDropdown, setShowSymptomsDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false); // if you're validating


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
    "Anxiety", "Appendicitis", "Arrhythmia", "Arthritis", "Asthma", "Atherosclerosis",
    "Autism", "Avoidant personality disorder", "Back pain", "Bacterial vaginosis",
    "Balance issues", "Basal cell carcinoma", "Binge eating", "Birthmarks", "Bladder infection",
    "Bleeding", "Bloating", "Blurred vision", "Body dysmorphic disorder", "Borderline personality disorder",
    "Breast lumps", "Breast pain", "Brief psychotic disorder", "Bronchitis", "Bruising", "Bulimia",
    "Bunions", "Burning sensation", "Celiac disease", "Chest pain", "Chest tightness", "Chills",
    "Chronic fatigue syndrome", "Chronic pain", "Cocaine use", "Cold", "Concentration problems",
    "Conduct disorder", "Confusion", "Constipation", "COPD", "Cough", "COVID-19", "Crohn's disease",
    "Cyclothymic disorder", "Dandruff", "Deep vein thrombosis", "Delusional disorder", "Dementia",
    "Dengue fever", "Dependent personality disorder", "Depression", "Diabetes", "Diarrhea", "Diverticulitis",
    "Dizziness", "Double vision", "Drug addiction", "Dysthymic disorder", "Ear infection", "Ear pain",
    "Eating disorders", "Eczema", "Elbow pain", "Endometriosis", "Epilepsy", "Erectile dysfunction",
    "Excoriation disorder", "Eye floaters", "Eye pain", "Facial pain", "Fainting", "Fast heart rate",
    "Fatigue", "Fever", "Fibroids", "Fibromyalgia", "Flat feet", "Flu", "Food allergies", "Food poisoning",
    "Foot pain", "Gallstones", "Gambling addiction", "Gas", "Gastritis", "Gastroenteritis", "Gout",
    "Hair loss", "Hallucinogen use", "Hand pain", "Headache", "Hearing loss", "Heart attack",
    "Heart failure", "Heartburn", "Heel spurs", "Hemophilia", "Hepatitis", "Hernia", "High arches",
    "High blood pressure", "High cholesterol", "Hip pain", "Histrionic personality disorder", "Hives",
    "Hoarding disorder", "Hormonal imbalances", "HIVIAIDS", "Hyperglycemia", "Hypoglycemia", "IBS",
    "Indigestion", "Infertility", "Ingrown nails", "Inhalant abuse", "Insomnia", "Internet addiction",
    "Intermittent explosive disorder", "Irregular heartbeat", "Irritability", "Itching", "Jaw pain",
    "Joint pain", "Kidney infection", "Kidney stones", "Kleptomania", "Knee pain", "Lactose intolerance",
    "Learning disabilities", "Leukemia", "Low blood pressure", "Low testosterone", "Lupus", "Lyme disease",
    "Lymphoma", "Malaria", "Marijuana use", "Melanoma", "Memory loss", "Menopause symptoms",
    "Menstrual irregularities", "Methamphetamine use", "Migraine", "Moles", "Mood swings",
    "Multiple sclerosis", "Muscle pain", "Myeloma", "Nail fungus", "Narcissistic personality disorder",
    "Nausea", "Neck pain", "Nerve pain", "Nipple discharge", "Numbness", "Obesity", "OCD",
    "Opioid addiction", "Oppositional defiant disorder", "Orthorexia", "Osteoarthritis",
    "Panic attacks", "Paranoid personality disorder", "Parkinson's disease", "Pelvic pain", "Peptic ulcer",
    "Phobias", "Plantar fasciitis", "Platelet disorders", "PMS", "Pneumonia", "Polycystic ovary syndrome",
    "Postpartum psychosis", "Prescription drug abuse", "Prostate issues", "Psoriasis", "PTSD",
    "Pyromania", "Rash", "Rheumatoid arthritis", "Rosacea", "Scalp itch", "Scars", "Schizoaffective disorder",
    "Schizoid personality disorder", "Schizophrenia", "Schizotypal personality disorder", "Seizures",
    "Sexually transmitted infections", "Shared psychotic disorder", "Shortness of breath", "Shoulder pain",
    "Sickle cell disease", "Sinusitis", "Skin cancer", "Sleep disorders", "Slow heart rate", "Smoking",
    "Sore throat", "Speech problems", "Squamous cell carcinoma", "Strep throat", "Stress", "Stroke",
    "Stretch marks", "Substance abuse", "Swelling", "Testicular pain", "Throat pain", "Thyroid disorders",
    "Tingling", "Tinnitus", "Tonsillitis", "Tooth pain", "Tremors", "Trichotillomania", "Tuberculosis",
    "Ulcerative colitis", "Underweight", "Urinary tract infection", "Vaping", "Varicose veins",
    "Vertigo", "Video game addiction", "Vision problems", "Vomiting", "Warts", "Weakness",
    "Wheezing", "Workaholism", "Wrist pain", "Yeast infection", "Zika virus"
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
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setSubmitted(true);
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
  
        // Optionally, you could store these in state if needed:
        // setUserLocation({ latitude, longitude });
  
        if (isFormValid()) {
          goToResultsPage();
        } else {
          setSubmitted(true);
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setSubmitted(true); // Optionally still mark form as submitted even if location fails
      }
    );
  };

  // azure function, params = lat, long, radius, cpt
  // function gets a list of the hospitals surrounding the coords
  // returns the list of hospitals

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
            <span style={{ color: "#241A90" }}>True</span>
            <span style={{ color: "#3AADA4" }}>Rate</span>
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
                <form onSubmit={handleSubmit} className="d-flex flex-column">
                  <div
                    className="d-flex align-items-center border rounded px-3 py-2"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderColor: submitted && details.trim() === "" ? "red" : "#ced4da",
                    }}
                  >
                    <textarea
                      id="details"
                      className="form-control border-0"
                      rows={1}
                      placeholder="Type your symptoms or preferences..."
                      style={{
                        resize: "none",
                        boxShadow: "none",
                        backgroundColor: "transparent",
                        fontSize: "1rem",
                        overflow: "hidden",
                      }}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn p-2"
                      style={{
                        backgroundColor: "#241A90",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "10px",
                        transition: "background-color 0.2s ease-in-out",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#3b2dbb")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#241A90")}
                    >
                      <FaArrowRight />
                    </button>
                  </div>

                  {submitted && details.trim() === "" && (
                    <div className="text-danger mt-2">
                      Please provide some information before proceeding.
                    </div>
                  )}
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
        © 2025 TrueRate. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Questionnaire;