import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";

type SignInRouteProps = {
    onSubmitClick: (email: string, password: string) => any;
}

function SignInRoute(props: SignInRouteProps) {
    const navigate = useNavigate();

    return <AuthForm
        type='signIn'
        onLinkClick={(type) => navigate(type === 'signIn' ? '/sign-in' : '/sign-up')}
        onSubmitClick={props.onSubmitClick} />
}

export default SignInRoute;