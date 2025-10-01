import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";

type SignUpRouteProps = {
    onSubmitClick: (email: string, password: string) => any;
}

function SignUpRoute(props: SignUpRouteProps) {
    const navigate = useNavigate();

    return <AuthForm
        type="signUp"
        onLinkClick={(type) => navigate(type === 'signIn' ? '/sign-in' : '/sign-up')}
        onSubmitClick={props.onSubmitClick} />;
}

export default SignUpRoute;