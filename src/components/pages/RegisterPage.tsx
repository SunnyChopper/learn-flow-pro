import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import RegisterForm from 'src/components/organisms/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ width: '400px' }}>
                <RegisterForm
                    onAlreadyLoggedIn={() => {
                        console.log('User is already logged in');
                    }}
                    onRegisterSuccess={() => {
                        console.log('User has successfully registered');
                    }}
                />
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Log in</Link>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterPage;