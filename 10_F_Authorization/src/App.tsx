import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type {
  AccessTokenPayload, SignInResponse, AuthFormRefBody
} from './types';
import AccountPage from './components/AccountPage/AccountPage';
import AuthForm from './components/AuthForm/AuthForm';
import saveTokensInStorage from './utils/saveTokensInStorage';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState(0);
  const [authorized, setAuthorized] = useState(false);

  const signUpFormRef = useRef<AuthFormRefBody>(null);
  const signInFormRef = useRef<AuthFormRefBody>(null);

  useEffect(() => {
    const accessJwt = localStorage.getItem('accessJwt');
    
    if(accessJwt) {
      const payload = jwtDecode(accessJwt) as AccessTokenPayload;

      if(payload) {
        const { email } = payload;

        setUsername(email);
        setNumber(2);
        setAuthorized(true);
      }
    } else {
      navigate('/sign-in');
    }
  }, []);

  const onSignInClick = async (email: string, password: string) => {
    const loginUrl = `http://localhost:3000/login?email=${email}&password=${password}`;
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const status = response.status;
    
    if(status === 200) {
      const data = await response.json();
      const { access_token, refresh_token } = data as SignInResponse;
      
      await saveTokensInStorage(access_token, refresh_token);
      
      const payload = jwtDecode(access_token) as AccessTokenPayload;
      const { email } = payload;

      setStates(email, 3, true);
      navigate('/me');
    } else
      signInFormRef.current?.showErrorMessage('Invalid email or password');
  }

  const onSignUpClick = async (email: string, password: string) => {
    const signUpUrl = `http://localhost:3000/sign_up`;
    const requestBody = { email, password };
    const response = await fetch(signUpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    const status = response.status;

    if(status === 200) {
      const data = await response.json();
      console.log(data);
      const { access_token, refresh_token } = data as SignInResponse;

      await saveTokensInStorage(access_token, refresh_token);

      const payload = jwtDecode(access_token) as AccessTokenPayload;
      const { email } = payload;

      setStates(email, 1, true);
      navigate('/me');
    } else
      signUpFormRef.current?.showErrorMessage('User with this email already exists');
  }

  const setStates = (username: string, number: number, authorized: boolean) => {
    setUsername(username);
    setNumber(number);
    setAuthorized(authorized);
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/me"
          element={
            <AccountPage
              username={username}
              number={number}
            />
          } />
        <Route
          path="/sign-in"
          element={
            <AuthForm
              ref={signInFormRef}
              type="signIn"
              onSubmitClick={onSignInClick}
              onLinkClick={() => navigate('/sign-up')} />
          } />
        <Route
          path="/sign-up"
          element={
            <AuthForm
              ref={signUpFormRef}
              type="signUp"
              onSubmitClick={onSignUpClick}
              onLinkClick={() => navigate('/sign-in')} />
          } />
      </Routes>
    </div>
  );
}

export default App;