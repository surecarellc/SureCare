import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useNavigation } from "./utils/goToFunctions.js";

const Results = () => {
  const {
    goToQuestionnairePage,
    goToLaunchPage,
    goToAboutPage,
    goToHelpPage,
    goToSignInPage,
  } = useNavigation();

  

  const location = useLocation();
  // Support either { results: [...] } or directly an array as state
    // Grab whatever was pushed via router state. Support:
  //   navigate('/results', stateArray)
  //   navigate('/results', { results: stateArray })
  //   navigate('/results', { state: { results: stateArray } }) ← react‑router signature
  const rawState = location.state;
  const results = Array.isArray(rawState)
    ? rawState
    : Array.isArray(rawState?.results)
    ? rawState.results
    : [];

  console.log("📦 location.state →", rawState);
  console.log("📊 parsed results length:", results.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="container d-flex flex-column min-vh-100 justify-content-start align-items-center text-center"
      style={{ paddingBottom: "80px" }}
    >
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

      <div className="row w-100 d-flex justify-content-center align-items-center flex-grow-1 mt-5">
        <div className="col-12 d-flex flex-column justify-content-center text-center mt-5">
          <p className="fs-1" style={{ fontWeight: "300" }}>
            Your Top Healthcare Options
          </p>
        </div>

        <div className="col-12 d-flex flex-column flex-md-row justify-content-center mb-5">
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
                {results.length === 0 ? (
                  <p className="text-muted">No results found. Try adjusting your search.</p>
                ) : (
                  results.map((result, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >
                      <div className="text-start">
                        <h5 className="fw-bold mb-1">{result.name || "Unknown Name"}</h5>
                        <p className="mb-0 text-muted">
                          Address: {result.address || "N/A"} | Rating: {result.rating ?? "N/A"}
                        </p>
                      </div>
                      {result.website ? (
                        <a
                          href={result.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-dark btn-sm"
                          style={{ borderRadius: "20px" }}
                        >
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-muted">No Website</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-4 d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-dark px-4 py-2"
            onClick={goToQuestionnairePage}
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

      <footer
        className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark px-0"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw" }}
      >
        © 2025 TrueRate. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default Results;
