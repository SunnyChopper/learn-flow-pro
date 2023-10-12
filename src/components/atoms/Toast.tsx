import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

interface ToastProps {
    message: string;
    severity: AlertColor;
    toastKey?: string;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Toast = ({ message, severity, toastKey }: ToastProps) => {
    const [open, setOpen] = useState(true);
    const [currentToastKey, setCurrentToastKey] = useState(toastKey);

    React.useEffect(() => {
        if (currentToastKey !== toastKey) {
            setCurrentToastKey(toastKey);
            setOpen(true);
        }
    }, [toastKey, currentToastKey]);

    const handleClose = (event: Event | React.SyntheticEvent<any, Event>, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <div>
                <Alert onClose={handleClose} severity={severity}>
                    {message || 'Something went wrong'}
                </Alert>
            </div>
        </Snackbar>
    );
}

export default Toast;