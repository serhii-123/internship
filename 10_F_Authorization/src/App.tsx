import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import type {
  SignInResponse, AuthFormRefBody, MeResponse
} from './types';
import AccountPage from './components/AccountPage/AccountPage';
import AuthForm from './components/AuthForm/AuthForm';
import saveTokensInStorage from './utils/saveTokensInStorage';
import './App.css';
import Fetcher from './classes/Fetcher';

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState(0);

  const signUpFormRef = useRef<AuthFormRefBody>(null);
  const signInFormRef = useRef<AuthFormRefBody>(null);

  useEffect(() => { init() }, []);

  const init = async () => {
    const accessJwt = localStorage.getItem('accessJwt');

    if(!accessJwt) {
      navigate('/sign-in');
      
      return;
    }

    const meResponse = await Fetcher.makeMeRequest(accessJwt);
    const meResponseStatus = meResponse.status;

    if(meResponseStatus === 200) {
      const body = await meResponse.json() as MeResponse;
      const { username } = body.data;

      setUsername(username);
      
      return;
    }

    const refreshJwt = localStorage.getItem('refreshJwt');

    if(!refreshJwt) {
      navigate('/sign-in');

      return;
    }

    const refreshResponse = await Fetcher.makeRefreshRequest(refreshJwt);
    const refreshResponseStatus = refreshResponse.status;

    if(refreshResponseStatus === 200) {
      const { access_token } = await refreshResponse.json();
      
      localStorage.setItem('access_token', access_token);
      
      const meResponse = await Fetcher.makeMeRequest(access_token);
      const meResponseStatus = meResponse.status;

      if(meResponseStatus === 200) {
        const body = await meResponse.json() as MeResponse;
        const { username } = body.data;

        setUsername(username);
      } else navigate('/sign-in');

      return;
    }

    navigate('/sign-in');
  }

  const onSignInClick = async (email: string, password: string) => {
    const response = await Fetcher.makeSignInRequest(email, password);
    const status = response.status;
    
    if(status === 200)
      processSuccessfulAuthRequest(response);
    else
      signInFormRef.current?.showErrorMessage('Invalid email or password');
  }

  const onSignUpClick = async (email: string, password: string) => {
    const response = await Fetcher.makeSignUpRequest(email, password);
    const status = response.status;

    if(status === 200) 
      processSuccessfulAuthRequest(response)
    else
      signUpFormRef.current?.showErrorMessage('User with this email already exists');
  }

  const processSuccessfulAuthRequest = async (response: Response) => {
    const data = await response.json();
    const { access_token, refresh_token } = data as SignInResponse;

    await saveTokensInStorage(access_token, refresh_token);

    const meResponse = await Fetcher.makeMeRequest(access_token);
    const body = await meResponse.json() as MeResponse;
    const { username } = body.data;

    setStates(username, 1);
    navigate('/me');
  }

  const setStates = (username: string, number: number) => {
    setUsername(username);
    setNumber(number);
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