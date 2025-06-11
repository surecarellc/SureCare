import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingPage = ({ loading }) => {
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  // 1. Start a 2.5s timer on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 2. Hide only after both conditions are true
  useEffect(() => {
    if (!loading && minTimePassed) {
      setShouldShow(false);
    }
  }, [loading, minTimePassed]);

  if (!shouldShow) return null;

  const letters = "SureCare".split("");

  const letterVariants = {
    initial: { y: 0 },
    animate: (i) => ({
      y: [0, -20, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity, // Keep animating indefinitely
        repeatDelay: 1.5,
        delay: i * 0.1,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
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
      <div className="text-center">
        <div
          style={{
            fontSize: "5rem",
            fontWeight: "700",
            fontStyle: "italic",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="initial"
              animate="animate"
              variants={letterVariants}
              style={{
                display: "inline-block",
                color: i < 4 ? "#241A90" : "#3AADA4",
                margin: "0 1px",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;