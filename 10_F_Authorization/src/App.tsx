import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccountPage from './components/AccountPage/AccountPage';
import AuthForm from './components/AuthForm/AuthForm';
import './App.css';
import SignInRoute from './components/SignInRoute/SignInRoute';
import SignUpRoute from './components/SignUpRoute/SignUpRoute';

function App() {
  const onLoginClick = (email: string, password: string) => {
    console.log(email, password);
  }

  const onSignUpClick = (email: string, password: string) => {
    console.log(email, password);
  }

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/me"
            element={<AccountPage />} />
          <Route
            path="/sign-in"
            element={
              <SignInRoute />
            } />
          <Route
            path="/sign-up"
            element={
             <SignUpRoute />
            } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;