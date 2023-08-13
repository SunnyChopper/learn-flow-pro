import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { TextField, Button, Box } from '@mui/material';
import { register } from 'src/utils/auth';

interface RegisterFormProps {
    onAlreadyLoggedIn: () => void;
    onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onAlreadyLoggedIn, onRegisterSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await register(email, password);
            onRegisterSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await Auth.currentAuthenticatedUser();
                onAlreadyLoggedIn();
            } catch (error) {
                console.error(error);
            }
        };
        checkAuth();
    }, [onAlreadyLoggedIn]);

    return (
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
        </Box>
    );
};

export default RegisterForm;