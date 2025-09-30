import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";

function SignInRoute() {
    const navigate = useNavigate();

    return <AuthForm
                type='signIn'
                onLinkClick={(type) => navigate(type === 'signIn' ? '/sign-in' : '/sign-up')}
                onSubmitClick={(email, password) => console.log(email, password)} />
}

export default SignInRoute;