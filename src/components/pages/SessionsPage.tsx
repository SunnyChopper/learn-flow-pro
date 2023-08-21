// System
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// Material UI
import { Button, Grid, Modal, Typography, CircularProgress } from '@mui/material';

// Database
import { LearningSession } from 'src/entity/LearningSession';

// Components
import Header from 'src/components/organisms/Header';

// API
import { fetchLearningSessions, createLearningSession } from 'src/api/sessions';

// Styles
import { sessionStyles } from 'src/styles/pages';

const SessionsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<LearningSession[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => { 
        setIsLoading(true);
        fetchLearningSessions().then((response: LearningSession[]) => {
            setSessions(response);
        }).catch((error) => {
            console.log(error);
            setError(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleCreateSession = () => { setIsModalOpen(true); };
    const handleModalClose = () => { setIsModalOpen(false); };

    const handleConfirmCreateSession = async () => {
        setIsCreating(true);
        try {
            const session: LearningSession = await createLearningSession();
            setSessions([...sessions, session]);
            setIsCreating(false);
            setIsModalOpen(false);
        } catch (error: any) {
            setCreateError(error);
            setIsCreating(false);
        }
    };

    const navigateToSession = (sessionId?: number) => {
        console.log(`Navigate to /sessions/${sessionId}`);
        navigate(`/sessions/${sessionId}`);
    }

    return (
        <>
            <Header />
            <Grid container style={sessionStyles.container} maxWidth="md">
                <Grid container item justifyContent="space-between">
                    <Typography variant="h4" component="h1">Sessions</Typography>
                    <Button variant="outlined" onClick={handleCreateSession} style={sessionStyles.button}>
                        + Create Session
                    </Button>
                </Grid>
            </Grid>
            <Grid container style={sessionStyles.container} maxWidth="md">
                {isLoading && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Grid>
                )}

                {!isLoading && sessions.length === 0 && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="body1" component="p">No sessions found.</Typography>
                    </Grid>
                )}

                {!isLoading && sessions.length > 0 && sessions.map((session: LearningSession) => { 
                    return (
                        <Grid item onClick={() => { navigateToSession(session.id); }} xs={12} key={session.id} style={{ cursor: 'pointer', backgroundColor: '#fafafa', marginBottom: '16px', padding: '16px', borderRadius: '12px', boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)' }}>
                            <Typography variant="h5" component="h5" style={{ marginBottom: '8px' }}>{session.title}</Typography>
                            {session.summary && (
                                <Typography variant="body1" component="p" style={{ marginBottom: '8px' }}>{session.summary}</Typography>
                            )}
                            <Typography variant="body1" component="p" style={{ marginBottom: '0px' }}>Created: {new Date(session.createdAt || '').toDateString()}</Typography>
                        </Grid>
                    )
                })}
            </Grid>

            <Modal open={isModalOpen} onClose={handleModalClose}>
                <div style={sessionStyles.modal}>
                    <Typography variant="h5" component="h5" style={{ marginBottom: '0px' }}>
                        Create new session?
                    </Typography>
                    <Typography variant="body1" component="p" style={{ marginBottom: '16px' }}>This will create a new learning session for {new Date().toLocaleDateString()}</Typography>
                    {isCreating && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <CircularProgress />
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={handleModalClose} style={{ marginRight: '8px', color: '#1a1a1a', borderColor: '#1a1a1a' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" disabled={isCreating || isLoading} onClick={handleConfirmCreateSession} color="primary" style={sessionStyles.button}>
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SessionsPage;