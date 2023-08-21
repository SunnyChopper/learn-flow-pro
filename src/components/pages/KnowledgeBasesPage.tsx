// System
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// Material UI
import { Button, Grid, Modal, Typography, CircularProgress, TextField, Divider } from '@mui/material';

// Database
import { KnowledgeBase } from 'src/entity/KnowledgeBase';

// API
import { createKnowedgeBaseForUser, fetchKnowledgeBasesForUser } from 'src/api/knowledge-bases';

// Components
import Header from 'src/components/organisms/Header';

// Styles
import { sessionStyles } from 'src/styles/pages';

const KnowledgeBasesPage = () => {
    // Data fetching
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [createError, setCreateError] = useState<string>('');

    // Knowledge bases
    const [newKnowledgeBase, setNewKnowledgeBase] = useState<KnowledgeBase>({} as KnowledgeBase);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

    // Add knowledge base modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => { 
        setIsLoading(true);
        fetchKnowledgeBasesForUser().then((knowledgeBases) => {
            setKnowledgeBases(knowledgeBases);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const navigateToSession = (id?: number) => {
        navigate(`/knowledge-bases/${id}`);
    };

    const handleCreateKnowledgeBase = async () => {
        setCreateError('');
        if (!newKnowledgeBase.title) {
            setCreateError('Please enter a title.');
            return;
        }

        setIsCreating(true);
        // TODO: Add call to the backend API using the `newKnowledgeBase` variable
        let savedKnowledgeBase: KnowledgeBase | undefined;
        try {
            savedKnowledgeBase = await createKnowedgeBaseForUser(newKnowledgeBase);
        } catch (error: any) {
            setCreateError(error.message);
        } finally {
            setIsCreating(false);
            
            if (savedKnowledgeBase) {
                setKnowledgeBases([...knowledgeBases, savedKnowledgeBase]);
                setNewKnowledgeBase({} as KnowledgeBase);
                setIsCreateModalOpen(false);
            }
        }
    }

    return (
        <>
            <Header />
            <Grid container style={sessionStyles.container} maxWidth="md">
                <Grid container item justifyContent="space-between">
                    <Typography variant="h4" component="h1">Knowledge Bases</Typography>
                    <Button variant="outlined" onClick={() => { setIsCreateModalOpen(true); }} style={sessionStyles.button}>
                        + Create Knowledge Base
                    </Button>
                </Grid>
            </Grid>
            <Grid container style={sessionStyles.container} maxWidth="md">
                {isLoading && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Grid>
                )}

                {!isLoading && knowledgeBases.length === 0 && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="body1" component="p">No knowledge bases found.</Typography>
                    </Grid>
                )}

                {!isLoading && knowledgeBases.length > 0 && knowledgeBases.map((session: KnowledgeBase) => {
                    return (
                        <Grid item onClick={() => { navigateToSession(session.id); }} xs={12} key={session.id} style={{ cursor: 'pointer', backgroundColor: '#fafafa', marginBottom: '16px', padding: '16px', borderRadius: '12px', boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)' }}>
                            <Typography variant="h5" component="h5" style={{ marginBottom: '8px' }}>{session.title}</Typography>
                            {session.description && (
                                <Typography variant="body1" component="p" style={{ marginBottom: '8px' }}>{session.description}</Typography>
                            )}
                            <Typography variant="body1" component="p" style={{ marginBottom: '0px' }}>Created: {new Date(session.createdAt || '').toDateString()}</Typography>
                        </Grid>
                    )
                })}
            </Grid>

            <Modal open={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); }}>
                <div style={sessionStyles.modal}>
                    <Typography variant="h5" component="h5" style={{ marginBottom: '0px' }}>
                        Create a Knowledge Base
                    </Typography>
                    <Divider style={{ marginTop: '6px', marginBottom: '8px' }} />
                    <Typography variant="body1" component="p" style={{ marginBottom: '16px' }}>A knowledge base is a collection of information that you want your GPT bot to use as a source of truth when helping you make the most of what you've learned.</Typography>
                    <TextField
                        label="Title"
                        variant="outlined"
                        style={{ marginBottom: '16px' }}
                        fullWidth
                        value={newKnowledgeBase.title}
                        onChange={(event) => { setNewKnowledgeBase({ ...newKnowledgeBase, title: event.target.value }); }}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        style={{ marginBottom: '16px' }}
                        fullWidth
                        multiline
                        rows={4}
                        value={newKnowledgeBase.description}
                        onChange={(event) => { setNewKnowledgeBase({ ...newKnowledgeBase, description: event.target.value }); }}
                    />
                    {isCreating && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <CircularProgress />
                        </div>
                    )}
                    {createError && (
                        <Typography variant="body1" component="p" style={{ marginBottom: '16px', color: 'red' }}>{createError}</Typography>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={() => { setIsCreateModalOpen(false); }} style={{ marginRight: '8px', color: '#1a1a1a', borderColor: '#1a1a1a' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" disabled={isCreating || isLoading} onClick={handleCreateKnowledgeBase} color="primary" style={sessionStyles.button}>
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default KnowledgeBasesPage;