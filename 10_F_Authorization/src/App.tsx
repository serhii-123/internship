import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccountPage from './components/AccountPage/AccountPage';
import './App.css';
import SignInRoute from './components/SignInRoute/SignInRoute';
import SignUpRoute from './components/SignUpRoute/SignUpRoute';

function App() {
  const onSignInClick = (email: string, password: string) => {
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