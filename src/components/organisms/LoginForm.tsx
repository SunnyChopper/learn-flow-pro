import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { TextField, Button, Box } from '@mui/material';
import { login } from 'src/utils/auth';

interface LoginFormProps {
    onAlreadyLoggedIn: () => void;
    onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAlreadyLoggedIn, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(email, password);
            onLoginSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            console.log('Checking auth...');
            try {
                await Auth.currentAuthenticatedUser();
                onAlreadyLoggedIn();
            } catch (error) {
                console.error(error);
            }
        };
        checkAuth();
    }, []);

    return (
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Log in</Button>
        </Box>
    );
};

export default LoginForm;