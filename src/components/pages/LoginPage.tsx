import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginForm from 'src/components/organisms/LoginForm';

const LoginPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ width: '400px' }}>
                <LoginForm
                    onAlreadyLoggedIn={() => {
                        console.log('User is already logged in');
                    }}
                    onLoginSuccess={() => {
                        console.log('User has successfully logged in');
                    }}
                />
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;