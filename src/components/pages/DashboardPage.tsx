// System
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Grid, Typography, Button, Divider, Chip, CircularProgress } from '@mui/material';

// Components
import Header from 'src/components/organisms/Header';

// Entities
import { Recommendation } from 'src/entity/Recommendation';

// API
import { generateTopicRecommendations, fetchRecommendations } from 'src/api/recommendations';

// Styles
import { dashboardStyles } from 'src/styles/pages';

const DashboardPage = () => {
    const [topicRecommendations, setTopicRecommendations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        generateTopicRecommendations().then((recommendations) => {
            setTopicRecommendations(recommendations.topics);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleViewAllSessions = () => { navigate('/sessions'); };

    return (
        <>
            <Header />
            <Grid container spacing={3} style={dashboardStyles.container} maxWidth="md">
                <Grid item xs={12} style={{
                    marginTop: '64px', marginBottom: '24px',
                    padding: '16px', backgroundColor: '#e4e4e4',
                    borderRadius: '8px', boxShadow: '0px 2px 8px -2px rgba(0,0,0,0.3)'
                }}>
                    <Typography variant="h5" gutterBottom>Recommended Topics</Typography>
                    <Typography variant="body1" gutterBottom>Based on your article history and learning goals, the system recommends the following topics for you to learn.</Typography>
                    <Divider style={{width:'100%', margin:'16px 0'}}/>
                    <Grid container spacing={2}>
                        {!isLoading && topicRecommendations.map((topic, index) => (
                            <Grid item key={index}>
                                <Chip label={topic} variant="outlined" style={{ backgroundColor: '#fafafa' }} />
                            </Grid>
                        ))}

                        {!isLoading && topicRecommendations.length === 0 && (
                            <Grid item>
                                <Typography variant="body1" gutterBottom>No recommendations available.</Typography>
                            </Grid>
                        )}

                        {isLoading && (
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: '32px', marginBottom: '24px' }}>
                                <CircularProgress size={24} />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
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