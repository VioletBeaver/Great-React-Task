import { createContext, useContext, useMemo, useState } from 'react';
import { getIsAuthorized } from './auth';


const AuthContext = createContext({
  userData: undefined,
  isAuthorized: false,
  updateAuthData: () => {}
});

function AuthProvider({ children }) {
  const [authData, updateAuthData] = useState({ userData: undefined, isAuthorized: getIsAuthorized() });
  const contextValue = useMemo(() => ({ ...authData, updateAuthData }), [authData, updateAuthData]);
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
export { useAuth };
