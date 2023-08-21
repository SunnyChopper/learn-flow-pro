// System
import { useState, useEffect } from 'react';
import moment from 'moment';

// Components
import Header from 'src/components/organisms/Header';

// Material UI
import { Button, Grid, Modal, Typography, CircularProgress, TextField } from '@mui/material';

// Entity
import { Goal } from 'src/entity/Goal';

// Styles
import { sessionStyles } from 'src/styles/pages';

// API
import { fetchGoalsForUser, createGoalForUser } from 'src/api/goals';

const GoalsPage = () => {
    // Goal list
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    
    // Create goal modal
    const [newGoal, setNewGoal] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchGoals().finally(() => {
            setIsLoading(false);
        });
    }, []);

    const fetchGoals = async () => {
        try {
            const goals = await fetchGoalsForUser();
            setGoals(goals);
        } catch (error: any) {
            console.error(error);
        }
    }

    const handleCreateGoal = () => {
        setIsCreating(true);
        setCreateError(null);
        
        const newGoalToMake: Goal = new Goal();
        newGoalToMake.goal = newGoal;
        createGoalForUser(newGoalToMake).then(() => {
            setIsModalOpen(false);
            fetchGoals();
        }).catch((error: any) => {
            console.error(error);
            setCreateError(error.message);
        }).finally(() => { 
            setIsCreating(false);
        });
    }

    return (
        <>
            <Header />
            <Grid container style={sessionStyles.container} maxWidth="md">
                <Grid container item justifyContent="space-between">
                    <Typography variant="h4" component="h1">Your Goals</Typography>
                    <Button variant="outlined" onClick={() => { setIsModalOpen(true); }} style={sessionStyles.button}>
                        + Create Goal
                    </Button>
                </Grid>
            </Grid>
            <Grid container style={sessionStyles.container} maxWidth="md">
                {isLoading && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Grid>
                )}

                {!isLoading && goals.length === 0 && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f4f4f4', borderRadius: '12px', padding: '32px' }}>
                        <Typography variant="body1" component="p">No goals found.</Typography>
                    </Grid>
                )}

                {!isLoading && goals.length > 0 && goals.map((goal: Goal) => { 
                    return (
                        <Grid item xs={12} key={goal.id} style={{ backgroundColor: '#f4f4f4', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                            <Typography variant="body1" component="p" style={{ marginBottom: '8px' }}>{goal.goal}</Typography>
                            <Typography variant="body1" component="p">Created on {moment(goal.createdAt).format('MMM Do, YYYY')}</Typography>
                        </Grid>
                    )
                })}
            </Grid>

            <Modal open={isModalOpen} onClose={() => { setIsModalOpen(false); }}>
                <div style={sessionStyles.modal}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h5" style={{ marginBottom: '16px' }}>Create new goal</Typography>
                            <TextField
                                multiline
                                minRows={4}
                                id="goal"
                                label="Goal"
                                variant="outlined"
                                disabled={isCreating || isLoading}
                                value={newGoal}
                                onChange={(event) => { setNewGoal(event.target.value); }}
                                style={{ marginBottom: '8px', width: '100%' }}
                            />
                        </Grid>

                        {createError && (
                            <Grid item xs={12}>
                                <Typography variant="body1" component="p" style={{ marginBottom: '16px', color: 'red', textAlign: 'center' }}>{createError}</Typography>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Typography variant="body1" component="p" style={{ marginBottom: '16px' }}>This will create a new goal for you to work on.</Typography>
                        </Grid>
                        
                        <Grid container item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {isCreating && (
                                <CircularProgress size="32px" style={{ marginRight: '8px' }} />
                            )}
                            <Button variant="outlined" onClick={() => { setIsModalOpen(false); }} style={{ marginRight: '8px', color: '#1a1a1a', borderColor: '#1a1a1a' }}>
                                Cancel
                            </Button>
                            <Button variant="contained" disabled={isCreating || isLoading} onClick={handleCreateGoal} color="primary" style={sessionStyles.button}>
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </>
    );
};

export default GoalsPage;