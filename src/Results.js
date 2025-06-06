import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigation } from "./utils/goToFunctions.js";
import { geocodeAddress } from "./services/userService";
import LoadingPage from "./components/LoadingPage";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "20px",
};

const centerDefault = { lat: 39.5, lng: -98.35 };

function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 3958.8;
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
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const initialSearchLocation = location.state?.searchLocation || {
    lat: allResults[0]?.lat || centerDefault.lat,
    lng: allResults[0]?.lng || centerDefault.lng,
    address: "Unknown Location",
  };
  const [searchLocation, setSearchLocation] = useState(initialSearchLocation);
  const mapCenter = {
    lat: searchLocation.lat,
    lng: searchLocation.lng,
  };

  const [radius, setRadius] = useState(5);
  const [newAddress, setNewAddress] = useState("");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredResults = useMemo(() => {
    if (allResults.length === 0) return [];
    const centerLat = searchLocation.lat;
    const centerLng = searchLocation.lng;

    return allResults.filter((r) => {
      if (!r.lat || !r.lng) return false;
      const dist = getDistanceMiles(centerLat, centerLng, r.lat, r.lng);
      return dist <= radius;
    });
  }, [allResults, radius, searchLocation]);

  const panToLocation = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(16);
    }
  };

  const handleAddressSubmit = async () => {
    if (!newAddress.trim()) {
      alert("Please enter a valid address.");
      return;
    }
    setIsProcessingLocation(true);
    try {
      const geocodedData = await geocodeAddress(newAddress);
      if (geocodedData && typeof geocodedData.lat === "number" && typeof geocodedData.lng === "number") {
        setSearchLocation({
          lat: geocodedData.lat,
          lng: geocodedData.lng,
          address: newAddress,
        });
        setShowAddressPopup(false);
        setNewAddress("");
      } else {
        alert(`Could not find a precise location for the address: "${newAddress}". Please check the address.`);
      }
    } catch (error) {
      console.error("Geocoding API error for address:", newAddress, error);
      alert(`There was an error trying to find the location for "${newAddress}": ${error.message}. Please try again.`);
    } finally {
      setIsProcessingLocation(false);
    }
  };

  // Fetch address suggestions from Nominatim with debounce and sorting by relevance
  const fetchAddressSuggestions = async (query) => {
    if (!query || query.trim() === "") {
      setAddressSuggestions([]);
      return;
    }
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=5&countrycodes=us`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SureCare/1.0 (contact@surecare.com)' }
      });
      if (!res.ok) return;
      const data = await res.json();
      // Only include suggestions that have a house_number and road (i.e., full street address)
      const filteredData = data.filter(s => {
        const addr = s.address || {};
        return addr.house_number && addr.road;
      });
      // Sort suggestions by importance (higher importance means closer match)
      const sortedData = filteredData.sort((a, b) => b.importance - a.importance);
      setAddressSuggestions(sortedData);
    } catch {
      setAddressSuggestions([]);
    }
  };

  // Debounced version of fetchAddressSuggestions
  const debouncedFetchSuggestions = (query) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, 300); // 300ms debounce
  };

  if (loadError) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h3 className="text-danger mb-3">Error loading maps</h3>
        <p>Please try refreshing the page</p>
      </div>
    </div>
  );
  
  if (!isLoaded || showLoading) {
    return <LoadingPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="container d-flex flex-column min-vh-100 justify-content-center align-items-center text-center"
      style={{ paddingTop: "150px", paddingBottom: "80px", maxWidth: "1550px" }}
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

      <div className="row w-100 d-flex justify-content-center align-items-start flex-grow-1 mt-2">
        <div className="col-md-6">
          <div className="d-flex justify-content-start mb-3">
            <div className="btn-group me-2">
              <button
                type="button"
                className="btn dropdown-toggle text-white px-3 py-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "#343A40",
                  border: "1px solid #343A40",
                  borderRadius: "20px",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  fontSize: "0.9rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#495057";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#343A40";
                  e.target.style.borderColor = "#343A40";
                }}
              >
                Adjust Radius: {radius} mi
              </button>
              <div className="dropdown-menu p-2" style={{ minWidth: "300px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <div className="text-center mb-2">
                  <strong>{radius} mile{radius > 1 ? "s" : ""}</strong>
                </div>
                <input
                  type="range"
                  id="dropdownRadiusRange"
                  min="1"
                  max="50"
                  step="1"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn text-white px-3 py-1"
                onClick={() => setShowAddressPopup(true)}
                style={{
                  backgroundColor: "#343A40",
                  border: "1px solid #343A40",
                  borderRadius: "20px",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  fontSize: "0.9rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#495057";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#343A40";
                  e.target.style.borderColor = "#343A40";
                }}
              >
                {searchLocation.address !== "Unknown Location" ? `Location: ${searchLocation.address}` : "Set Location"}
              </button>
            </div>
          </div>
          <div className="card shadow-lg" style={{ borderRadius: "20px", maxHeight: "550px", overflowY: "auto", width: "100%", textAlign: "left" }}>
            <div className="card-body p-4">
              <h3 className="fw-bold mb-2">Top Matches</h3>
              <hr className="my-3" style={{ borderTop: "2px solid #ddd" }} />

              {filteredResults.length === 0 ? (
                <p className="text-muted">No results found within the selected radius.</p>
              ) : (
                filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="border-bottom pb-4 mb-4"
                    onClick={() => panToLocation(result.lat, result.lng)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">{result.name || "Unknown Name"}</h5>
                      <div className="badge bg-secondary text-white px-3 py-2 rounded-pill" style={{ fontSize: "0.9rem" }}>
                        Price: N/A
                      </div>
                    </div>
                    <div className="text-muted mt-2">
                      Address: {result.address || "N/A"} <br />
                      Rating: {result.rating ?? "N/A"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="d-flex justify-content-start mb-3">
            <div className="btn-group">
              <button
                type="button"
                className="btn dropdown-toggle text-white px-3 py-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "#343A40",
                  border: "1px solid #343A40",
                  borderRadius: "20px",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  fontSize: "0.9rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#495057";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#343A40";
                  e.target.style.borderColor = "#343A40";
                }}
              >
                Filter By
              </button>
              <div className="dropdown-menu p-2" style={{ minWidth: "300px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <p className="text-muted mb-0">Filter options coming soon...</p>
              </div>
            </div>
          </div>
          <div className="card shadow-lg" style={{ borderRadius: "20px", height: "550px", backgroundColor: "#f8f9fa" }}>
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
      </div>

      <div className="col-12 mt-2 mb-2 d-flex justify-content-center">
        <button
          type="button"
          className="btn text-white px-3 py-1"
          onClick={goToQuestionnairePage}
          style={{
            backgroundColor: "#343A40",
            border: "1px solid #343A40",
            borderRadius: "20px",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
            fontSize: "0.9rem",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#495057";
            e.target.style.borderColor = "#495057";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#343A40";
            e.target.style.borderColor = "#343A40";
          }}
        >
          Back to Questionnaire
        </button>
      </div>

      <AnimatePresence>
        {showAddressPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setShowAddressPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "12px",
                minWidth: "300px",
                maxWidth: "500px",
                width: "90%",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddressPopup(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
                aria-label="Close address popup"
              >
                <FaTimes />
              </button>
              <h4 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#333" }}>Enter Your Address</h4>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={newAddress}
                  onChange={e => {
                    setNewAddress(e.target.value);
                    debouncedFetchSuggestions(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="E.g., 1600 Amphitheatre Parkway, Mountain View, CA 94043"
                  rows={3}
                  style={{
                    width: "100%", marginBottom: "1.5rem", padding: "0.75rem",
                    borderRadius: "8px", border: "1px solid #ced4da", fontSize: "1rem",
                    resize: "none", boxSizing: "border-box"
                  }}
                  disabled={isProcessingLocation}
                  onFocus={() => { if (newAddress) setShowSuggestions(true); }}
                  onBlur={() => setShowSuggestions(false)}
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "calc(100% + 4px)",
                    background: "#fff",
                    border: "1px solid #ced4da",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 3000,
                    maxHeight: "180px",
                    overflowY: "auto",
                    marginTop: "-1.5rem"
                  }}>
                    {addressSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "0.75rem 1rem",
                          cursor: "pointer",
                          borderBottom: idx !== addressSuggestions.length - 1 ? "1px solid #eee" : "none",
                          fontSize: "1rem"
                        }}
                        onMouseDown={() => {
                          setNewAddress(s.display_name);
                          setShowSuggestions(false);
                          setAddressSuggestions([]);
                        }}
                      >
                        {s.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleAddressSubmit}
                style={{
                  width: "100%", background: "#241A90", color: "#fff",
                  padding: "0.75rem", borderRadius: "8px", border: "none",
                  fontSize: "1rem", cursor: "pointer",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#3b2dbb")}
                onMouseOut={e => (e.currentTarget.style.background = "#241A90")}
                disabled={isProcessingLocation}
              >
                {isProcessingLocation ? "Processing..." : "Use this Address"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer
        className="text-center p-4 text-muted bg-white shadow-sm border-dark"
        style={{ position: "fixed", bottom: 0, left: "0", right: "0", width: "100%", borderTop: "1px solid white" }}
      >
        © 2025 SureCare. All Rights Reserved.
      </footer>
    </motion.div>
  );
};

export default Results;