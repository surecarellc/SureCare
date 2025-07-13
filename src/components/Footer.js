import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem 0",
        textAlign: "center",
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: "1px solid #000000",
      }}
    >
      <p style={{ margin: 0, color: "#6c757d" }}>
        © {new Date().getFullYear()} SureCare. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer; 