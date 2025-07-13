import React, { useEffect, useState } from 'react';
import fullLogo from '../components/full_logo1.png'; // adjust path if needed

const LoadingPage = ({ loading }) => {
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && minTimePassed) {
      setShouldShow(false);
    }
  }, [loading, minTimePassed]);

  if (!shouldShow) return null;

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 flex-column"
      style={{
        backgroundColor: "#ffffff",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <img
        src={fullLogo}
        alt="SureCare Logo"
        style={{ height: "100px", width: "auto", marginBottom: "30px" }}
      />
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #ddd",
          borderTop: "4px solid #241A90", // Sure color
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {/* Keyframes definition via inline <style> tag */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingPage;
