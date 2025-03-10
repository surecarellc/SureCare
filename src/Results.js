import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();

  // Navigation functions
  const goToLaunchPage = () => {
    navigate("/"); // Navigate back to the LaunchPage
  };

  const goToQuestionnaire = () => {
    navigate("/questionnaire"); // Navigate back to the Questionnaire
  };

  // Placeholder data for top 6 healthcare providers
  const dummyResults = [
    { name: "Health Clinic A", priceRange: "$50 - $100", distance: "2.3 miles", website: "https://healthclinica.com" },
    { name: "City Hospital", priceRange: "$80 - $150", distance: "3.1 miles", website: "https://cityhospital.org" },
    { name: "Family Care Center", priceRange: "$40 - $90", distance: "1.8 miles", website: "https://familycarecenter.com" },
    { name: "Downtown Medical", priceRange: "$60 - $120", distance: "4.5 miles", website: "https://downtownmedical.com" },
    { name: "Wellness Hub", priceRange: "$70 - $130", distance: "2.9 miles", website: "https://wellnesshub.org" },
    { name: "Prime Health", priceRange: "$55 - $110", distance: "3.7 miles", website: "https://primehealth.com" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="container d-flex flex-column min-vh-100 justify-content-start align-items-center text-center"
      style={{ paddingBottom: "80px"}} // Added paddingTop for upward shift
    >
      <div className="row w-100 d-flex justify-content-center align-items-center flex-grow-1 mt-2">
        {/* Title Section */}
        <div className="col-12 d-flex flex-column justify-content-center text-center mb-1">
          <a
            className="navbar-brand cursor-pointer"
            onClick={goToLaunchPage}
            style={{ fontSize: "2rem", fontWeight: "700", cursor: "pointer" }}
          >
            <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
              <span style={{ color: "#241A90" }}>Sure</span>
              <span style={{ color: "#3AADA4" }}>Care</span>
            </h1>
          </a>
          <p className="fs-3" style={{ fontWeight: "300" }}>
            Your Top Healthcare Options
          </p>
        </div>

        {/* Main Content: Map and Results */}
        <div className="col-12 d-flex flex-column flex-md-row justify-content-center">
          {/* Map Section */}
          <div className="col-md-5 mb-4 mb-md-0">
            <div
              className="card shadow-lg"
              style={{
                borderRadius: "20px",
                height: "500px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
              }}
            >
              <p className="text-muted fs-4">Insert Map Later</p>
            </div>
          </div>

          {/* Results List Section */}
          <div className="col-md-7">
            <div
              className="card shadow-lg"
              style={{
                borderRadius: "20px",
                maxHeight: "500px",
                overflowY: "auto",
                width: "100%",
              }}
            >
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Top Matches</h3>
                {dummyResults.map((result, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div className="text-start">
                      <h5 className="fw-bold mb-1">{result.name}</h5>
                      <p className="mb-0 text-muted">
                        Price Range: {result.priceRange} | Distance: {result.distance}
                      </p>
                    </div>
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark btn-sm"
                      style={{ borderRadius: "20px" }}
                    >
                      Visit Website
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="col-12 mt-4 d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-dark px-4 py-2"
            onClick={goToQuestionnaire}
            style={{
              backgroundColor: "#343a40",
              border: "none",
              borderRadius: "30px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#6c757d")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#343a40")}
          >
            Back to Questionnaire
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark px-0"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100vw",
        }}
      >
        © 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default Results;
