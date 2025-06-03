import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigation } from "./utils/goToFunctions.js";

const HelpPage = () => {
  const { goToAboutPage, goToSignInPage, goToLaunchPage } = useNavigation();

  // State for FAQ collapse
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // State for contact form
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("error");
      return;
    }
    // Simulate form submission (replace with actual API call in production)
    setTimeout(() => {
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  // Refs for scroll animations
  const helpRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);
  const helpInView = useInView(helpRef, { amount: 0.3 }); // Removed once: true
  const faqInView = useInView(faqRef, { amount: 0.3 }); // Removed once: true
  const contactInView = useInView(contactRef, { amount: 0.3 }); // Removed once: true

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const faqVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { scale: 1.02, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" },
  };

  // Sample FAQs
  const faqs = [
    {
      question: "How does SureCare provide price transparency?",
      answer: "SureCare aggregates real-time pricing data from healthcare providers, allowing you to compare costs for procedures and services before making a decision.",
      icon: "fas fa-dollar-sign",
    },
    {
      question: "Can I access telehealth services through SureCare?",
      answer: "Yes, SureCare connects you with quality providers offering telehealth options for consultations and guidance.",
      icon: "fas fa-video",
    },
    {
      question: "Is SureCare available for uninsured individuals?",
      answer: "Absolutely! SureCare is designed to help everyone, including uninsured and underinsured individuals, find affordable care options.",
      icon: "fas fa-user-shield",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="d-flex flex-column min-vh-100 align-items-center text-center p-4"
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-0"
        style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}
      >
        <div className="container-fluid d-flex justify-content-between">
          <button
            onClick={goToLaunchPage}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: "700",
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
            aria-label="Go to Home Page"
          >
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </button>
          <div className="d-flex">
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToAboutPage}
              aria-label="Go to About Page"
            >
              About
            </button>
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Stay on Help Page"
            >
              Help
            </button>
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToSignInPage}
              aria-label="Go to Sign In Page"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Help Section */}
      <motion.div
        ref={helpRef}
        variants={sectionVariants}
        initial="hidden"
        animate={helpInView ? "visible" : "hidden"}
        className="flex-fill d-flex flex-column justify-content-center align-items-center w-100 py-5"
      >
        <h1
          className="display-4 fw-bold mb-3"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#241A90",
            fontSize: "clamp(2rem, 10vw, 3.5rem)",
          }}
        >
          How We Help
        </h1>
        <p
          className="lead mb-5"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: "300",
            maxWidth: "800px",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
          }}
        >
          At SureCare, we are committed to helping you navigate your healthcare options with
          confidence and clarity. Our mission is to provide price transparency, empowering you to
          make informed decisions without the guesswork. Explore our FAQs or contact us for
          personalized support.
        </p>
      </motion.div>

      {/* FAQ Section */}
      <motion.section
        ref={faqRef}
        variants={sectionVariants}
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        className="w-100 py-5 bg-light"
      >
        <div className="container">
          <h2
            className="display-5 fw-bold mb-4 text-center"
            style={{
              fontFamily: "Outfit, sans-serif",
              color: "#241A90",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div className="row justify-content-center">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="col-12 col-md-8 mb-3"
                variants={faqVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="card border-0 shadow-sm">
                  <div
                    className="card-header bg-white d-flex align-items-center"
                    onClick={() => toggleFaq(index)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-collapse-${index}`}
                  >
                    <i className={`${faq.icon} fa-2x me-3`} style={{ color: "#3AADA4" }}></i>
                    <h5
                      className="mb-0"
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: "700",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      }}
                    >
                      {faq.question}
                    </h5>
                    <i
                      className={`fas fa-chevron-${openFaq === index ? "up" : "down"} ms-auto`}
                      style={{ color: "#241A90" }}
                    ></i>
                  </div>
                  <motion.div
                    id={`faq-collapse-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: openFaq === index ? "auto" : 0,
                      opacity: openFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="card-body">
                      <p
                        style={{
                          fontFamily: "Outfit, sans-serif",
                          fontWeight: "300",
                          fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        ref={contactRef}
        variants={sectionVariants}
        initial="hidden"
        animate={contactInView ? "visible" : "hidden"}
        className="w-100 py-5"
        style={{
          background: "linear-gradient(135deg, #3AADA4, #241A90)",
          color: "white",
        }}
      >
        <div className="container">
          <h2
            className="display-5 fw-bold mb-4 text-center"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            Contact Us
          </h2>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 position-relative">
                  <i
                    className="fas fa-user position-absolute"
                    style={{ top: "12px", left: "12px", color: "#241A90" }}
                  ></i>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control ps-5"
                    placeholder="Your Name"
                    aria-label="Your Name"
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <i
                    className="fas fa-envelope position-absolute"
                    style={{ top: "12px", left: "12px", color: "#241A90" }}
                  ></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control ps-5"
                    placeholder="Your Email"
                    aria-label="Your Email"
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <i
                    className="fas fa-comment position-absolute"
                    style={{ top: "12px", left: "12px", color: "#241A90" }}
                  ></i>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-control ps-5"
                    placeholder="Your Message"
                    rows="4"
                    aria-label="Your Message"
                    required
                  ></textarea>
                </div>
                {formStatus === "error" && (
                  <p className="text-danger mb-3">Please fill out all fields.</p>
                )}
                {formStatus === "success" && (
                  <p className="text-success mb-3">Message sent successfully!</p>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1, backgroundColor: "#241A90" }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-4 py-2 rounded-pill shadow"
                  style={{
                    backgroundColor: "#3AADA4",
                    color: "white",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "1.1rem",
                    border: "none",
                  }}
                  aria-label="Submit Contact Form"
                >
                  Send Message
                </motion.button>
                <p
                  className="text-center mt-2"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.9rem",
                    color: "#E0E0E0",
                  }}
                >
                  Or email us at{" "}
                  <a
                    href="mailto:surecare.contact@gmail.com"
                    style={{ color: "#3AADA4", textDecoration: "none" }}
                  >
                    surecare.contact@gmail.com
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark px-0">
        © 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default HelpPage;