import React from 'react';
import { Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from 'src/components/organisms/LoginForm';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const afterLogin = () => {
        console.log('Login successful. Redirecting...');
        
        navigate('/dashboard');
        
        if (window.sessionStorage.getItem('redirected')) {
            window.sessionStorage.removeItem('redirected');
        } else {
            window.sessionStorage.setItem('redirected', 'true');
            window.location.reload();
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ width: '400px' }}>
                <LoginForm
                    onAlreadyLoggedIn={afterLogin}
                    onLoginSuccess={afterLogin}
                />
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;