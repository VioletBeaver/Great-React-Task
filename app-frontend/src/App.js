import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Messages from './Messages';
import OneMessage from './OneMessage';
import AuthProvider, { useAuth } from './AuthContext';
import { useEffect } from 'react';
import axios from 'axios';


function AppContent() {
  const { updateAuthData, isAuthorized } = useAuth();

  useEffect(() => {
    const fetchSelfData = async () => {
      const response = await axios.get('http://localhost:8000/api/users/me');
      updateAuthData(curr => ({ ...curr, userData: response.data }));
    };

    if (isAuthorized) {
      fetchSelfData();
    }
  }, [isAuthorized]);

  return (
    <BrowserRouter>
      <Switch>
        <Route component={SignUp} path='/sign_up' />
        <Route component={LogIn} path='/log_in' />
        {isAuthorized && (
          <>
            <Route component={Messages} path='/messages' />
            {/*<Route component={OneMessage} path='/messages/:id(\\d+)' />*/}
          </>
        )}
        <Redirect to='/sign_up' />
      </Switch>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
