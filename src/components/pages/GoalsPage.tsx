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
import { fetchGoalsForUser, createGoalForUser, updateGoalForUser, deleteGoal } from 'src/api/goals';

const GoalsPage = () => {
    // Goal list
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    
    // Create goal modal
    const [newGoal, setNewGoal] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Edit goal modal
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    // Delete goal modal
    const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchGoals().finally(() => {
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [showSuccessMessage]);

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
            setNewGoal('');
            setIsModalOpen(false);
            fetchGoals();
        }).catch((error: any) => {
            console.error(error);
            setCreateError(error.message);
        }).finally(() => { 
            setIsCreating(false);
        });
    }
    
    const handleUpdateGoal = () => {
        setIsUpdating(true);
        setUpdateError(null);

        if (goalToEdit) {
            updateGoalForUser(goalToEdit).then((updatedGoal: Goal) => {
                const updatedGoals = goals.map((goal: Goal) => {
                    if (goal.id === updatedGoal.id) {
                        return updatedGoal;
                    }
                    return goal;
                });
                setGoals(updatedGoals);
                setShowSuccessMessage(true);
            }).catch((error: any) => {
                console.error(error);
                setUpdateError(error.message);
            }).finally(() => {
                setIsUpdating(false);
            });
        }
    }

    const handleOpenEditModal = (goal: Goal) => {
        setGoalToEdit(goal);
        setIsEditModalOpen(true);
    }

    const handleDeleteGoal = (goal: Goal) => {
        setGoalToDelete(goal);
        setIsDeleteModalOpen(true);
    }

    const confirmDeleteGoal = () => {
        setIsDeleting(true);
        setDeleteError(null);

        if (goalToDelete) {
            deleteGoal(goalToDelete).then(() => {
                setIsDeleteModalOpen(false);
                fetchGoals();
            }).catch((error: any) => {
                console.error(error);
                setDeleteError(error.message);
            }).finally(() => {
                setIsDeleting(false);
            });
        }
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
                            <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" component="p">Created on {moment(goal.createdAt).format('MMM Do, YYYY')}</Typography>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Button variant="outlined" color="secondary" onClick={() => { handleOpenEditModal(goal); }} style={{ marginRight: '8px' }}>Edit</Button>
                                    <Button variant="outlined" color="error" onClick={() => { handleDeleteGoal(goal); }}>Delete</Button>
                                </div>
                            </Grid>
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

            <Modal open={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); }}>
                <div style={sessionStyles.modal}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h5" style={{ marginBottom: '16px' }}>Edit goal</Typography>
                            <TextField
                                multiline
                                minRows={4}
                                id="edit-goal"
                                label="Goal"
                                variant="outlined"
                                disabled={isUpdating || isLoading}
                                value={goalToEdit?.goal}
                                onChange={(event) => {
                                    if (goalToEdit) {
                                        setGoalToEdit({ ...goalToEdit, goal: event.target.value });
                                    }
                                }}
                                style={{ marginBottom: '8px', width: '100%' }}
                            />
                        </Grid>

                        {updateError && (
                            <Grid item xs={12}>
                                <Typography variant="body1" component="p" style={{ marginBottom: '16px', color: 'red', textAlign: 'center' }}>{updateError}</Typography>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Typography variant="body1" component="p" style={{ marginBottom: '16px' }}>You are editing your previously created goal.</Typography>
                        </Grid>

                        {showSuccessMessage && (
                            <Grid item xs={12}>
                                <Typography variant="body1" component="p" color="green" style={{ marginBottom: '16px' }}></Typography>Update successful!
                            </Grid>
                        )}
                        
                        <Grid container item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {isUpdating && (
                                <CircularProgress size="32px" style={{ marginRight: '8px' }} />
                            )}
                            <Button variant="outlined" onClick={() => { setIsModalOpen(false); }} style={{ marginRight: '8px', color: '#1a1a1a', borderColor: '#1a1a1a' }}>
                                Cancel
                            </Button>
                            <Button variant="contained" disabled={isUpdating || isLoading} onClick={handleUpdateGoal} color="primary" style={sessionStyles.button}>
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </div>             
            </Modal>

            <Modal open={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); }}>
                <div style={sessionStyles.modal}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h5" style={{ marginBottom: '16px' }}>Delete goal</Typography>
                            <Typography variant="body1" component="p" style={{ marginBottom: '16px' }}>Are you sure you want to delete this goal?</Typography>
                        </Grid>

                        {deleteError && (
                            <Grid item xs={12}>
                                <Typography variant="body1" component="p" style={{ marginBottom: '16px', color: 'red', textAlign: 'center' }}>{deleteError}</Typography>
                            </Grid>
                        )}
                        
                        <Grid container item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {isDeleting && (
                                <CircularProgress size="32px" style={{ marginRight: '8px' }} />
                            )}
                            <Button variant="outlined" onClick={() => { setIsDeleteModalOpen(false); }} style={{ marginRight: '8px', color: '#1a1a1a', borderColor: '#1a1a1a' }}>
                                Cancel
                            </Button>
                            <Button variant="contained" disabled={isDeleting} onClick={confirmDeleteGoal} color="primary" style={sessionStyles.button} size="small">
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </>
    );
};

export default GoalsPage;