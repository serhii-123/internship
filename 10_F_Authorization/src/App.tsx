import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import AccountPage from './components/AccountPage/AccountPage';
import SignInRoute from './components/SignInRoute/SignInRoute';
import SignUpRoute from './components/SignUpRoute/SignUpRoute';
import saveTokensInStorage from './utils/saveTokensInStorage';
import './App.css';

type AccessTokenPayload = {
  username: string,
  number: number,
}

type SignInResponse = {
  accessToken: string,
  refreshToken: string,
}

function App() {
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState(0);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const accessJwt = localStorage.getItem('accessJwt');
    
    if(accessJwt) {
      const payload = jwt.decode(accessJwt) as AccessTokenPayload;

      if(payload) {
        const { username, number } = payload;

        setUsername(username);
        setNumber(number);
        setAuthorized(true);
      }      
    }
  }, []);

  const onSignInClick = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const status = response.status;
    
    if(status === 200) {
      const data = await response.json();
      const { accessToken, refreshToken } = data as SignInResponse;
      
      await saveTokensInStorage(accessToken, refreshToken);
      
      const payload = jwt.decode(accessToken) as AccessTokenPayload;
      const { username, number } = payload as AccessTokenPayload;

      setStates(username, number, true);
    }
  }

  const onSignUpClick = (email: string, password: string) => {
    console.log(email, password);
  }

  const setStates = (username: string, number: number, authorized: boolean) => {
    setUsername(username);
    setNumber(number);
    setAuthorized(authorized);
  }

  return (
    <div className="app">
      <Router>
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
              <SignInRoute
                onSubmitClick={onSignInClick} />
            } />
          <Route
            path="/sign-up"
            element={
              <SignUpRoute
                onSubmitClick={onSignUpClick} />
            } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;