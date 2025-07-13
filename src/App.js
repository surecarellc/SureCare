import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchPage from "./LaunchPage";
import AboutPage from "./AboutPage";
import HelpPage from "./HelpPage";
import Questionnaire from "./Questionnaire";
import SignIn from "./SignIn";
import Results from "./Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;