import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';

const Footer: React.FC = () => {

    return (
        <Box id="footer" sx={{ py: 4, backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ mb: 2 }}>About Us</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>Welcome to Turbo Learn AI. We're here to help young professionals in data science and software engineering learn more in less time. Our tool sorts through lots of articles on Medium, picks out what you need for your job, and helps you get better at what you do. We believe in making learning easy and useful. Thanks for stopping by!</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        
                    </Grid>
                    <Grid item xs={12} md={4}>
                        
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="body1" align="center">&copy; 2023 TurboLearnAI. All rights reserved.</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;