import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';

const styles = {
    container: {
        py: '3rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        '@media (max-width: 600px)': {
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem'
        },
        '@media (min-width: 600px) and (max-width: 1024px)': {
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem'
        }
    }
}

const PricingTable: React.FC = () => {
    return (
        <Box sx={styles.container}>
            <Grid container spacing={4} justifyContent="center" maxWidth="lg">
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Free: Basic</Typography>
                        <Typography variant="h3" sx={{ mb: 2 }}>$0.00/<small>mo</small></Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>This tier gives you access to what you need to get started.</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Sort 5 articles per learning session</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'orange' }}>Limited sorting options</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>No knowledge base capabilities</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>No personalized recommendations</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {/* <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>Ads-supported experience</Typography>
                        <Divider sx={{ mb: 2 }} /> */}
                        <Button variant="contained" color="primary">Sign Up</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Curiosity</Typography>
                        <Typography variant="h3" sx={{ mb: 2 }}>$3.99/<small>mo</small></Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>This tier unlocks just enough to improve your learning experience.</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Sort 10 articles per learning session</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Advanced sorting options</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'orange' }}>Basic knowledge base capabilities</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>No personalized recommendations</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {/* <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>Ads-supported experience</Typography>
                        <Divider sx={{ mb: 2 }} /> */}
                        <Button variant="contained" color="primary">Sign Up</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Self-Learner</Typography>
                        <Typography variant="h3" sx={{ mb: 2 }}>$9.99/<small>mo</small></Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>This tier gives you access to everything you need to learn.</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Sort ∞ articles per learning session</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Advanced sorting options</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Full knowledge base capabilities</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2, color: 'green' }}>Personalized recommendations</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {/* <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>Ads-supported experience</Typography>
                        <Divider sx={{ mb: 2 }} /> */}
                        <Button variant="contained" color="primary">Sign Up</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PricingTable;