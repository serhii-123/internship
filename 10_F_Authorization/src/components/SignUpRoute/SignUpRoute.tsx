import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";

function SignUpRoute() {
    const navigate = useNavigate();

    return <AuthForm
                type="signUp"
                onLinkClick={(type) => navigate(type === 'signIn' ? '/sign-in' : '/sign-up')}
                onSubmitClick={(email, password) => console.log(email, password)} />;
}

export default SignUpRoute;