import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import { register } from 'src/utils/auth';

interface RegisterFormRowProps {
    onAlreadyLoggedIn: () => void;
    onRegisterSuccess: () => void;
}

const styles = {
    container: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        width: '100%',
        py: 4,
        mt: 2,
    },
    formTitle: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '1rem',
        textShadow: '0 5px 10px rgba(20,20,20,0.35)',
        '@media (max-width: 600px)': {
            fontSize: '1.75rem'
        },
        '@media (min-width: 600px) and (max-width: 960px)': {
            fontSize: '1.5rem'
        }
    },
    formBodyText: {
        color: '#fff',
        marginBottom: '1rem',
        textShadow: '0 5px 10px rgba(20,20,20,0.35)',
        '@media (max-width: 600px)': {
            fontSize: '1rem'
        },
        '@media (min-width: 600px) and (max-width: 960px)': {
            fontSize: '0.75rem'
        }
    },
    infoContainer: {
        padding: '1rem'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        background: '#f0f0f0',
        padding: '1.5rem',
        margin: '0 auto',
        borderRadius: '0.5rem',
        boxShadow: '0 5px 50px rgba(20,20,20,0.15)',
        overflow: 'hidden',
        '@media (max-width: 1024px)': {
            width: '80%'
        }
    },
    emailField: {
        mb: 2,
        borderRadius: '0.25rem',
        backgroundColor: '#fafafa',
        color: '#FE6B8B',
        transition: 'all 0.25s ease-in-out',
        '& > .MuiInputBase-root': {
            transition: 'all 0.25s ease-in-out',
            '&:hover': {
                backgroundColor: '#fff',
                borderColor: 'red'
            },
        },
        '& > .MuiInputBase-root.Mui-focused > fieldset.MuiOutlinedInput-notchedOutline': {
            border: '2px solid #FE6B8B'
        },
        '& .MuiOutlinedInput-notchedOutline > legend > span': {
            color: '#FE6B8B'
        }
    },
    passwordField: {
        mb: 1,
        borderRadius: '0.25rem',
        backgroundColor: '#fafafa',
        color: '#FE6B8B',
        transition: 'all 0.25s ease-in-out',
        '& > .MuiInputBase-root': {
            transition: 'all 0.25s ease-in-out',
            '&:hover': {
                backgroundColor: '#fff',
                borderColor: 'red'
            },
        },
        '& > .MuiInputBase-root.Mui-focused > fieldset.MuiOutlinedInput-notchedOutline': {
            border: '2px solid #FE6B8B'
        },
        '& .MuiOutlinedInput-notchedOutline > legend > span': {
            color: '#FE6B8B'
        }
    },
    registerButton: {
        mt: 2,
        width: '100%',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: '#fff',
        '&:hover': {
            bgcolor: '#005fa3'
        }
    }
}

const RegisterFormRow: React.FC<RegisterFormRowProps> = ({ onAlreadyLoggedIn, onRegisterSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Registering user...');
        // If email is empty, make the border red
        // If password is empty, make the border red
        // If both are empty, make both borders red
        // If both are not empty, register the user
        setEmailError('');
        setPasswordError('');

        if (email === '') {
            setEmailError('Please enter an email.');
        }

        if (password === '') {
            setPasswordError('Please enter a password.');
        }

        // try {
        //     await register(email, password);
        //     onRegisterSuccess();
        // } catch (error) {
        //     console.error(error);
        // }
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
        <Box sx={styles.container}>
            <Grid container spacing={0} justifyContent="center" alignItems="center" maxWidth="lg" sx={{ margin: 'auto' }}>
                <Grid item xs={12} md={5} lg={7} sx={styles.infoContainer}>
                    <Typography variant="h5" sx={styles.formTitle}>Get Started on Your Learning Journey Today!</Typography>
                    <Typography variant="body1" sx={styles.formBodyText}>Ready to take your skills to the next level? Join Turbo Learn AI now and unlock a world of focused, tailored content designed to help you excel. Sign up is quick and easy -- just enter your email, create a password and dive into a smarter way of learning!</Typography>
                </Grid>
                <Grid item xs={12} md={7} lg={5} sx={{ padding: '1rem' }}>
                    <Box component="form" onSubmit={handleRegister} sx={styles.formContainer}>
                        <TextField label="Email" type="email" value={email} sx={styles.emailField} InputLabelProps={{ style: { color: '#FE6B8B' } }} onChange={(event) => setEmail(event.target.value)} error={emailError !== ''} helperText={emailError} />
                        <TextField label="Password" type="password" value={password} sx={styles.passwordField} InputLabelProps={{ style: { color: '#FE6B8B' } }} onChange={(event) => setPassword(event.target.value)} error={passwordError !== ''} helperText={passwordError} />
                        <Button type="submit" variant="contained" sx={styles.registerButton}>Create Account</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterFormRow;