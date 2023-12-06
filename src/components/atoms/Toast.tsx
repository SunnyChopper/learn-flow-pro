import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";

interface ToastProps {
    message: string;
    severity: AlertColor;
    toastKey?: string;
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
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}>
                <ReactMarkdown rehypePlugins={[rehypeRaw] as any}>{message}</ReactMarkdown>
            </MuiAlert>
        </Snackbar>
    );
}

export default Toast;