import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchPage from "./LaunchPage"; // Your existing LaunchPage component
import AboutPage from "./AboutPage"; // The new AboutPage component
import HelpPage from "./HelpPage"; 
import Questionnaire from "./Questionnaire"; // The updated Questionnaire component
import SignIn from "./SignIn"; // The SignIn component
import SignUp from "./SignUp"; // The SignUp component
import Results from "./Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/questionnaire" element={<Questionnaire />} /> {/* Updated Route */}
        <Route path="/signin" element={<SignIn />} /> {/* Added SignIn Route */}
        <Route path="/signup" element={<SignUp />} /> {/* Added SignUp Route */}
        <Route path="/results" element={<Results />} /> {/* Added SignUp Route */}
      </Routes>
    </Router>
  );
}

export default App;
