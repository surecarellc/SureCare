import React, { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigation } from "./utils/goToFunctions.js";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "20px",
};

const centerDefault = { lat: 39.5, lng: -98.35 }; // Center of the US
 
// Haversine formula to calculate distance between two lat/lng points in miles
function getDistanceMiles(lat1, lng1, lat2, lng2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 3958.8; // Radius of Earth in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Results = () => {
  const {
    goToQuestionnairePage,
    goToLaunchPage,
    goToAboutPage,
    goToHelpPage,
    goToSignInPage,
  } = useNavigation();

  const location = useLocation();
  const allResults = useMemo(() => {
    const rawState = location.state;
      if (Array.isArray(rawState)) return rawState;
      if (Array.isArray(rawState?.results)) return rawState.results;
      return [];
    }, [location.state]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);

  const mapCenter =
    allResults.length > 0 && allResults[0].lat && allResults[0].lng
      ? { lat: allResults[0].lat, lng: allResults[0].lng }
      : centerDefault;

  // State for radius in miles, default 5, min 1
  const [radius, setRadius] = useState(5);

  // Filter results based on radius around first hospital
  const filteredResults = useMemo(() => {
    if (allResults.length === 0) return [];

    const centerLat = allResults[0].lat;
    const centerLng = allResults[0].lng;

    return allResults.filter((r) => {
      if (!r.lat || !r.lng) return false;
      const dist = getDistanceMiles(centerLat, centerLng, r.lat, r.lng);
      return dist <= radius;
    });
  }, [allResults, radius]);

  const panToLocation = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(16);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

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
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
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

      {/* Radius scrollbar replacing the top heading */}
      <div
        className="w-100 d-flex justify-content-center align-items-center mt-5 pt-4"
        style={{ maxWidth: "600px" }}
      >
        <label htmlFor="radiusRange" className="me-3 fs-5" style={{ minWidth: "130px" }}>
          Search Radius: <strong>{radius} mile{radius > 1 ? "s" : ""}</strong>
        </label>
        <input
          type="range"
          id="radiusRange"
          min="1"
          max="50"
          step="1"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ flexGrow: 1 }}
        />
      </div>

      <div className="row w-100 d-flex justify-content-center align-items-center flex-grow-1 mt-3">
        <div className="col-12 d-flex flex-column justify-content-center text-center mt-2">
          {/* Removed the old heading here */}
        </div>

        <div className="col-12 d-flex flex-column flex-md-row justify-content-center mb-5">
          {/* Map */}
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="card shadow-lg" style={{ borderRadius: "20px", height: "500px", backgroundColor: "#f8f9fa" }}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={mapCenter}
                onLoad={(map) => (mapRef.current = map)}
              >
                {filteredResults.map((result, index) =>
                  result.lat && result.lng ? (
                    <Marker
                      key={index}
                      position={{ lat: result.lat, lng: result.lng }}
                      title={result.name}
                    />
                  ) : null
                )}
              </GoogleMap>
            </div>
          </div>

          {/* Results List */}
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
                {filteredResults.length === 0 ? (
                  <p className="text-muted">No results found within the selected radius.</p>
                ) : (
                  filteredResults.map((result, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                      onClick={() => panToLocation(result.lat, result.lng)}
                      style={{ cursor: "pointer" }}
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
                          onClick={(e) => e.stopPropagation()}
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

        {/* Back Button */}
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
        © 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default Results;
