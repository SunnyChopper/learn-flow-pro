// System
import React from 'react';

export const dashboardStyles: { [key: string]: React.CSSProperties } = {
    container: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '32px',
        marginBottom: '32px',
    }
};

export const sessionStyles: { [key: string]: React.CSSProperties } = {
    container: {
        margin: 'auto',
        marginTop: '32px',
        padding: '8px',
    },
    button: {
        backgroundColor: '#1a1a1a',
        color: '#fafafa',
        border: 'none'
    },
    modal: {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: 'auto',
        marginTop: '20vh',
        minWidth: '300px'
    },
    
};