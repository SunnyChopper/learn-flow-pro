// System
import { Routes, Route } from "react-router-dom";
import React from 'react';
import { Auth, Amplify } from "aws-amplify";

// Material UI
import { Grid, CircularProgress } from '@mui/material';

// Pages
import KnowledgeBaseDetailsPage from "./components/pages/KnowledgeBaseDetailsPage";
import KnowledgeBasesPage from "./components/pages/KnowledgeBasesPage";
import SessionDetailsPage from "./components/pages/SessionDetailsPage";
import DashboardPage from "./components/pages/DashboardPage";
import SessionsPage from "./components/pages/SessionsPage";
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import GoalsPage from "./components/pages/GoalsPage";

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
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		setIsLoading(true);
		checkAuth().finally(() => {
			setIsLoading(false);
		});
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

	if (isLoading) {
		return (
			<Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
				<CircularProgress />
			</Grid>
		);
	}
  
	return (
		<div>
			<Routes>
				{hasValidToken ? (
					<>
						<Route path="/" element={<DashboardPage />} />
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/sessions" element={<SessionsPage />} />
						<Route path="/sessions/:sessionId" element={<SessionDetailsPage />} />
						<Route path="/knowledge-bases" element={<KnowledgeBasesPage />} />
						<Route path="/knowledge-bases/:knowledgeBaseId" element={<KnowledgeBaseDetailsPage />} />
						<Route path="/goals" element={<GoalsPage />} />
						<Route path="*" element={<h1>404</h1>} />
					</>
				) : (
					<>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="*" element={<LoginPage />} />
					</>
				)}
			</Routes>
		</div>
	);
}

export default App;
