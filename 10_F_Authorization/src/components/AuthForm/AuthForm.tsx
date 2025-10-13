import {
    forwardRef, useEffect, useImperativeHandle, useRef, useState,
    type RefObject,
} from "react";
import './auth-form.css';
import Validator from "./utils/validator";
import InputEventHandler from "./utils/InputEventHandler";

type FormType = 'signIn' | 'signUp';
type LinkType = FormType;

type ForwardRefBody = {
    showErrorMessage: (msg: string) => void;
};

type AuthFormProps = {
    type: FormType;
    onSubmitClick: (email: string, password: string) => any;
    onLinkClick: (type: FormType) => any;
};

function AuthForm(props: AuthFormProps, ref: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [label, setLabel] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        showErrorMessage: (msg: string) => {
            setErrorMessage(msg);
        }
    }));

    useEffect(() => {
        setLabel(props.type === 'signIn' ? 'Sign In' : 'Sign Up');
    }, [props.type]);
    
    const onLinkClick = (type: LinkType) => {
        if(props.onLinkClick)
            props.onLinkClick(type);
    }

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const emailIsValid = await Validator.validateEmail(email);
        const passwordIsValid = await Validator.validatePassword(password);
        const emailStyle = (emailInputRef as RefObject<HTMLInputElement>)
            .current
            .style;
        const passwordStyle = (passwordInputRef as RefObject<HTMLInputElement>)
            .current
            .style;

        if(!emailIsValid)
            emailStyle.borderColor = 'rgb(255, 100, 100)';

        if(!passwordIsValid)
            passwordStyle.borderColor = 'rgb(255, 100, 100)';

        if(emailIsValid && passwordIsValid)
            props.onSubmitClick(email, password);
    }

    return <form className="auth-form">
        <h1 className="auth-form__heading">{label}</h1>
        <input
            key="emailInput"
            ref={emailInputRef}
            className="auth-form__input"
            type="text"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            onBlur={e => InputEventHandler.onEmailBlur(emailInputRef, e)}
            onSubmit={e => e.preventDefault()} />
        <input
            key="passwordInput"
            ref={passwordInputRef}
            className="auth-form__input"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            onBlur={e => InputEventHandler.onPasswordBlur(passwordInputRef, e)}
            onSubmit={e => e.preventDefault()} />
        <button
            className="auth-form__btn"
            type="submit"
            onClick={handleClick}
            onSubmit={handleClick} >
            {label}
        </button>

        {props.type === 'signIn' ?
            (
                <p className="auth-form__text">
                    <span>Don't have an account? </span>
                    <button
                        className="auth-form__link"
                        type="button"
                        onClick={() => onLinkClick('signUp')} >Sign Up</button>
                </p>
            ): (
                <p className="auth-form__text">
                    <span>Already have an account? </span>
                    <button
                        className="auth-form__link"
                        type="button"
                        onClick={() => onLinkClick('signIn')} >Sign in</button>
                </p>
            ) }
        
        {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

    </form>;
}

export default forwardRef<ForwardRefBody, AuthFormProps>(AuthForm);