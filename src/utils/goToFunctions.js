import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    goToAboutPage: () => navigate("/about"),
    goToQuestionnairePage: (state) => {
      // Ensure state is serializable; use empty object if invalid
      const safeState = state && typeof state === "object" && !state.preventDefault ? state : {};
      navigate("/questionnaire", { state: safeState });
    },
    goToSignInPage: () => navigate("/signin"),
    goToHelpPage: () => navigate("/help"),
    goToLaunchPage: () => navigate("/"),
    goToResultsPage: (state) => navigate("/results", { state }),
    goToSignUpPage: () => navigate("/signup"),
  };
};