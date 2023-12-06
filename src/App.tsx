// System
import "reflect-metadata";
import { Routes, Route } from "react-router-dom";
import { Auth, Amplify } from "aws-amplify";
import AWS from "aws-sdk";
import React from 'react';

// Material UI
import { Grid, CircularProgress } from '@mui/material';

// Public Pages
import HomeLandingPage from "./components/pages/public/HomeLandingPage";

// Pages
import KnowledgeBaseDetailsPage from "./components/pages/KnowledgeBaseDetailsPage";
import KnowledgeBasesPage from "./components/pages/KnowledgeBasesPage";
import SessionDetailsPage from "./components/pages/SessionDetailsPage";
import DashboardPage from "./components/pages/DashboardPage";
import SessionsPage from "./components/pages/SessionsPage";
import SettingsPage from "./components/pages/SettingsPage";
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import GoalsPage from "./components/pages/GoalsPage";

import { initializeAuth } from "src/utils/auth";

const asyncInit = async () => {
	await initializeAuth();
}

asyncInit();

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
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="*" element={<h1>404</h1>} />
					</>
				) : (
					<>
						<Route path="/" element={<HomeLandingPage />} />
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
