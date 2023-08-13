// System
import { Routes, Route } from "react-router-dom";
import React from 'react';
import { Auth, Amplify } from "aws-amplify";

// Pages
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';

Amplify.configure({
	Auth: {
		identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
		region: process.env.REACT_APP_USER_POOL_REGION || '',
		userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
		userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || '',
	}
});

function App() {
  const [hasValidToken, setHasValidToken] = React.useState<boolean>(false);

  React.useEffect(() => { 
		checkAuth();
  }, []);
  
  const checkAuth = async () => { 
		try {
			const session = await Auth.currentSession();
			const token = session.getIdToken().getJwtToken();
      if (token) {
        setHasValidToken(true);
      }
		} catch (error: any) {
			if (error !== 'No current user') {
        console.error(error);
      }
		}
  }
  
  return (
		<div style={{ marginBottom: "100px" }}>
			<Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
				{hasValidToken ? (
					<>
            <Route path="*" element={<LoginPage />} />
					</>
				) : (
					<Route path="*" element={<LoginPage />} />
				)}
			</Routes>
		</div>
	);
}

export default App;
