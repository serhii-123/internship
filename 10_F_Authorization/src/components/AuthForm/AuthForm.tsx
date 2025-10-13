import {
    forwardRef, useEffect, useImperativeHandle, useRef, useState,
} from "react";
import './auth-form.css';
import Validator from "./utils/validator";
import InputBlock from "../InputBlock/InputBlock";

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

    const emailInputRef = useRef<any>(null);
    const passwordInputRef = useRef<any>(null);

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

        if(!emailIsValid)
            emailInputRef.current.makeInvalid();

        if(!passwordIsValid)
            passwordInputRef.current.makeInvalid();

        if(emailIsValid && passwordIsValid)
            props.onSubmitClick(email, password);
    }

    return <form className="auth-form">
        <h1 className="auth-form__heading">{label}</h1>
        <InputBlock
            ref={emailInputRef}
            key="emailInput"
            className="auth-form__input-block"
            type="text"
            placeholder="Email"
            invalidInputMessage="Invalid email"
            validation={Validator.validateEmail}
            onChange={e => setEmail(e.target.value)} />
        <InputBlock
            ref={passwordInputRef}
            key="passwordInput"
            className="auth-form__input-block"
            type="password"
            placeholder="Password"
            invalidInputMessage="So short password"
            validation={Validator.validatePassword}
            onChange={e => setPassword(e.target.value)} />
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