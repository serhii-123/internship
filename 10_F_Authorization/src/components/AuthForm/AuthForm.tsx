import {
    forwardRef, useEffect, useImperativeHandle, useRef, useState,
    type FocusEvent, type RefObject
} from "react";
import './auth-form.css';

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

    const onEmailBlur = async(e: FocusEvent<HTMLInputElement>) => {
        const validationExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { value } = e.target;
        const isValid = validationExp.test(value);

        await changeBorderColorByValidationResult(passwordInputRef, isValid);
    }

    const onPasswordBlur = async(e: FocusEvent<HTMLInputElement>) => {
        const minLength = 8;
        const { value } = e.target;
        const isValid = value.length < minLength;

        await changeBorderColorByValidationResult(passwordInputRef, isValid);
    }

    const changeBorderColorByValidationResult = async(
        ref: RefObject<HTMLInputElement | null>,
        isValid: boolean
    ) => {
        const style = (ref.current as HTMLInputElement).style;

        if(isValid)
            style.borderColor = 'rgb(255, 255, 255)';
        else
            style.borderColor = 'rgb(255, 100, 100)';
    }

    useImperativeHandle(ref, () => ({
        showErrorMessage: (msg: string) => {
            setErrorMessage(msg);
        }
    }));

    useEffect(() => {
        setLabel(props.type === 'signIn' ? 'Sign In' : 'Sign Up');
    }, [props.type]);
    
    const onLinkClick = (type: LinkType) => {
        if (props.onLinkClick)
            props.onLinkClick(type);
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.onSubmitClick(email, password);
    }

    return <form className="auth-form">
        <h1 className="auth-form__heading">{label}</h1>
        <input
            ref={emailInputRef}
            className="auth-form__input"
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={onEmailBlur} />
        <input
            ref={passwordInputRef}
            className="auth-form__input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} />
        <button
            className="auth-form__btn"
            type="submit"
            onClick={handleClick} >
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