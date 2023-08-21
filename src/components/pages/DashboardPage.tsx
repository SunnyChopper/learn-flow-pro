// System
import { useNavigate } from 'react-router-dom';

// Material UI
import { Grid, Typography, Button, Divider } from '@mui/material';

// Components
import Header from 'src/components/organisms/Header';

// Styles
import { dashboardStyles } from 'src/styles/pages';

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleViewAllSessions = () => { navigate('/sessions'); };

    return (
        <>
            <Header />
            <Grid container spacing={3} style={dashboardStyles.container} maxWidth="md">
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>Learning Sessions</Typography>
                    {/* Add learning sessions section */}
                    <Button variant="contained" color="primary" size="small" onClick={handleViewAllSessions}>View All Sessions</Button>
                </Grid>
                <Divider style={{width:'100%', margin:'16px 0'}}/>
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>Latest Notes</Typography>
                    {/* Add latest notes section */}
                </Grid>
                <Divider style={{width:'100%', margin:'16px 0'}}/>
                <Grid item xs={12}>
                    <Typography variant="h5"  >Learning Stats</Typography>
                    {/* Add learning stats section */}
                </Grid>
            </Grid>
        </>
    );
};

export default DashboardPage;