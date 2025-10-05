import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type {
  SignInResponse, AuthFormRefBody, MeResponse
} from './types';
import AccountPage from './components/AccountPage/AccountPage';
import AuthForm from './components/AuthForm/AuthForm';
import Fetcher from './classes/Fetcher';
import saveTokensInStorage from './utils/saveTokensInStorage';
import './App.css';

function App() {
  const navigate = useNavigate();

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

    if(meResponseStatus === 200) return;

    const refreshJwt = localStorage.getItem('refreshJwt');

    if(!refreshJwt)
      return navigate('/sign-in');

    const refreshResponse = await Fetcher.makeRefreshRequest(refreshJwt);
    const refreshResponseStatus = refreshResponse.status;

    if(refreshResponseStatus === 200) {
      const { access_token } = await refreshResponse.json();
      
      localStorage.setItem('accessJwt', access_token);
      
      const meResponse = await Fetcher.makeMeRequest(access_token);
      const meResponseStatus = meResponse.status;

      if(meResponseStatus !== 200) 
        navigate('/sign-in');

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
    navigate('/me');
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/me"
          element={
            <AccountPage
              key="numberlessPage"
              numberless={true} />
          } />
        <Route
          path="/me/*"
          element={
            <AccountPage
              key="defaulPage"
              numberless={false} />
          } />
        <Route
          path="/sign-in"
          element={
            <AuthForm
              key="signInForm"
              ref={signInFormRef}
              type="signIn"
              onSubmitClick={onSignInClick}
              onLinkClick={() => navigate('/sign-up')} />
          } />
        <Route
          path="/sign-up"
          element={
            <AuthForm
              key="signUpForm"
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