import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
    const navigate = useNavigate();

    return {
        goToAboutPage: () => navigate("/about"),
        goToQuestionnairePage: () => navigate("/questionnaire"),
        goToSignInPage: () => navigate("/signin"),
        goToHelpPage: () => navigate("/help"),
        goToLaunchPage: () => navigate("/"),
        goToResultsPage: (state) => navigate("/results", { state }),
        goToSignUpPage: () => navigate("/signup")
    };
};