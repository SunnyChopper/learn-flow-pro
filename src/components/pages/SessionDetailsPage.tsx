// System
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Auth } from 'aws-amplify';

// Material UI
import {
    Grid, Button, Modal, TextField,
    Typography, CircularProgress, Divider,
    Accordion, AccordionSummary, AccordionDetails, Box, AlertColor
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

// Components
import Header from 'src/components/organisms/Header';
import Toast from 'src/components/atoms/Toast';

// API
import {
    createArticleForSession,
    fetchArticlesForSession,
    fetchNotesForSession,
    invokeSortingArticlesForSession,
    fetchSortedArticlesForSession,
    generateNotesForArticle,
    generateSummaryForArticle
} from 'src/api/articles';
import { fetchLearningSession } from 'src/api/sessions';

// Contracts
import { SortedArticles } from 'src/contracts/SortArticles';

// Entities
import { LearningSession } from 'src/entity/LearningSession';
import { Article } from 'src/entity/Article';
import { Note } from 'src/entity/Note';


interface ArticleInput {
    title: string;
    url: string;
    authors?: string;
}

interface SessionDetailsLoadingMap {
    learningSession: boolean;
    articles: boolean;
    notes: boolean;
    addArticle: boolean;
}

interface SessionDetailsPageProps {

}

const SessionDetailsPage: React.FC<SessionDetailsPageProps> = () => {
    const params = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    // UI
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastSeverity, setToastSeverity] = useState<AlertColor>('success');
    const [accordionExpanded, setAccordionExpanded] = useState<{ [key: string]: boolean }>({
        userArticles: true,
        sortedArticles: false,
        userNotes: false
    });

    // Data fetching
    const [addArticleSuccessMessage, setAddArticleSuccessMessage] = useState<string>('');
    // const [isGeneratingNotes, setIsGeneratingNotes] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSorting, setIsSorting] = useState<boolean>(false);
    const [sortingAction, setSortingAction] = useState<string | null>(null);
    const [resourceLoadingMap, setResourceLoadingMap] = useState<SessionDetailsLoadingMap>({
        learningSession: false,
        articles: false,
        notes: false,
        addArticle: false
    }); 

    // Create modal
    const [newArticle, setNewArticle] = useState<ArticleInput>({ title: '', url: '', authors: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Data
    // const [articleNotes, setArticleNotes] = useState<{ [key: string]: string }>({});
    const [sortedArticles, setSortedArticles] = useState<SortedArticles | null>(null);
    const [session, setSession] = useState<LearningSession | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => { 
        if (params.sessionId) {
            setResourceLoadingMap((prevMap) => ({ ...prevMap, learningSession: true }));
            setResourceLoadingMap((prevMap) => ({ ...prevMap, articles: true }));
            let learningSession: LearningSession | null = null;
            fetchLearningSession(parseInt(params.sessionId as string)).then((response) => {
                if (!response.id) {
                    throw new Error('Session ID not found.');
                }

                learningSession = response;
            }).catch((error) => {
                console.log(error);
                setLoadingError(error);
            }).finally(() => {
                setResourceLoadingMap((prevMap) => ({ ...prevMap, learningSession: false }));
                if (learningSession) { setSession(learningSession); }
            });
        }
    }, [params.sessionId]);

    useEffect(() => {
        if (session && session.id) {
            setResourceLoadingMap((prevMap) => ({ ...prevMap, articles: true }));
            let loadedArticles: Article[] = [];
            fetchArticlesForSession(session.id).then((articles: Article[]) => {
                loadedArticles = articles;
            }).catch((error) => {
                console.log(error);
                setLoadingError(error);
            }).finally(() => {
                setResourceLoadingMap((prevMap) => ({ ...prevMap, articles: false }));
                if (loadedArticles.length > 0) { setArticles(loadedArticles); }
            });
        }
    }, [session]);

    useEffect(() => { 
        if (session && session.id && articles.length > 0 && !sortedArticles) {
            const fetchSortedArticles = async () => {
                if (!session || !session.id) {
                    throw new Error('Session ID not found. Cannot sort articles.');
                }

                let sortedArticlesResponse: SortedArticles | null = null;
                setIsSorting(true);
                setSortingAction('Generating/retrieving summaries for articles...');

                try {
                    sortedArticlesResponse = await fetchSortedArticlesForSession(session.id);
                    if (sortedArticlesResponse?.sortedArticles) {
                        setSortedArticles({ sortedArticles: sortedArticlesResponse.sortedArticles });
                        setAccordionExpanded({
                            userArticles: false,
                            sortedArticles: true,
                            userNotes: false
                        });
                    }
                } catch (error) {
                    console.log(error);
                    throw error;
                } finally {
                    setIsSorting(false);
                    setSortingAction(null);
                }
            }

            fetchSortedArticles();

            // setResourceLoadingMap((prevMap) => ({ ...prevMap, notes: true }));
            // let notesByArticle: { [key: string]: string } = {};
            // fetchNotesForSession(session.id).then((notes: Note[]) => {
            //     notes.forEach((note) => {
            //         if (note.articleId) {
            //             const article: Article | undefined = articles.find((article) => article.id === note.articleId);
            //             if (article) {
            //                 notesByArticle[article.title] = note.note;
            //             } else {
            //                 console.log('Article not found for note:', note);
            //             }
            //         }
            //     });
            // }).catch((error) => {
            //     console.log(error);
            //     setLoadingError(error);
            // }).finally(() => { 
            //     setResourceLoadingMap((prevMap) => ({ ...prevMap, notes: false }));
            //     if (Object.keys(notesByArticle).length > 0) { setArticleNotes(notesByArticle); }
            // });
        }
    }, [session, articles]);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleNewArticleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewArticle((prevArticle) => ({ ...prevArticle, [name]: value }));
    };

    const handleNewArticleSubmit = async () => {
        setResourceLoadingMap((prevMap) => ({ ...prevMap, addArticle: true }));
        console.log('Submitting new article:', newArticle);
        if (!session || !session.id) {
            throw new Error('Session ID not found. Cannot submit article.');
        }

        const userId = await Auth.currentAuthenticatedUser().then((user) => {
            return user.attributes.sub;
        }).catch((error) => {
            console.log(error);
            throw new Error('Unable to get the user ID. Cannot submit article.');
        });

        const articleToCreate: Article = new Article();
        articleToCreate.userId = userId;
        articleToCreate.sessionId = session.id;
        articleToCreate.url = newArticle.url;
        // NOTE: These two will be set on the backend.
        articleToCreate.title = '';
        articleToCreate.authors = '';

        createArticleForSession(articleToCreate).then((response) => {
            console.log(response);
            setArticles((prevArticles) => ([...prevArticles, response]));
            setNewArticle({ title: '', url: '', authors: '' });
            setAddArticleSuccessMessage(`Successfully added ${response.title}`);
            setTimeout(() => {
                setAddArticleSuccessMessage('');
            }, 3000);
        }).catch((error) => {
            console.log(error);
            throw new Error('Unable to create article. Please try again.');
        }).finally(() => {
            setResourceLoadingMap((prevMap) => ({ ...prevMap, addArticle: false }));
        });
    };

    const handleSortArticles = async () => {
        if (!session || !session.id) {
            throw new Error('Session ID not found. Cannot sort articles.');
        }

        setIsSorting(true);
        setSortingAction('Generating/retrieving summaries for articles...');
        setToastMessage('Generating/retrieving summaries for articles...');
        setToastSeverity('info');

        // Check if all articles have summaries.
        const articlesWithoutSummaries: number = articles.filter((article) => !article.summary).length;
        let articlesToSort: Article[] = [];
        if (articlesWithoutSummaries > 0) {
            // Generate summaries for each article.
            await Promise.allSettled(articles.map(async (article) => {
                if (!article.id) {
                    throw new Error('No article ID found.');
                }

                if (article.summary) {
                    return Promise.resolve();
                }

                const response = await generateSummaryForArticle(article.id);

                // NOTE: Updating the state variable will trigger a re-render and
                // show the summary for the article.
                setArticles(prevArticles => prevArticles.map((prevArticle) => {
                    if (prevArticle.id === article.id) {
                        prevArticle.summary = response.summary;
                    }

                    return prevArticle;
                }));

                articlesToSort.push({ ...article, summary: response.summary });

                return Promise.resolve();
            }));
        } else {
            articlesToSort = articles;
        }

        setSortingAction('Sorting articles...');
        setToastMessage('Sorting articles...');
        setToastSeverity('info');
        setAccordionExpanded({
            userArticles: false,
            sortedArticles: true,
            userNotes: false
        });

        try {
            await invokeSortingArticlesForSession(session.id, articlesToSort);
        } catch (error) {
            console.log(error);
            setIsSorting(false);
            setSortingAction(null);
            setToastMessage('Unable to sort articles. Please try again.');
            setToastSeverity('error');
            throw error;
        }

        let lambdaResponse: SortedArticles | null = null;
        const interval = setInterval(async () => {
            if (!session || !session.id) {
                throw new Error('Session ID not found. Cannot sort articles.');
            }

            try {
                lambdaResponse = await fetchSortedArticlesForSession(session.id);
                if (lambdaResponse?.sortedArticles) {
                    console.log('Sorted articles:', lambdaResponse);
                    setSortedArticles({ sortedArticles: lambdaResponse.sortedArticles });
                    setToastMessage('Successfully sorted articles.');
                    setToastSeverity('success');
                    clearInterval(interval);
                    setIsSorting(false);
                    setSortingAction(null);
                }
            } catch (error) {
                console.log(error);
                setIsSorting(false);
                setSortingAction(null);
                setToastMessage('Unable to sort articles. Please try again.');
                setToastSeverity('error');
                clearInterval(interval);
                throw error;
            }
        }, 5000);

        // Use a timeout to cap the time spent waiting for the articles to be sorted to 3 minutes.
        setTimeout(() => {
            if (!lambdaResponse) {
                setIsSorting(false);
                setSortingAction(null);
                setToastMessage('Timed out while sorting articles. Please try again.');
                setToastSeverity('error');
                if (interval) { clearInterval(interval); }
            }
        }, 180000);
    };

    // const handleGenerateNotes = async (articleId: number) => {
    //     const article: Article | undefined = articles.find((article) => article.id === articleId);
    //     if (!article) { throw new Error('Article not found. Cannot generate notes.'); }

    //     setIsGeneratingNotes(true);
    //     generateNotesForArticle(articleId).then((response) => {
    //         console.log(response);
    //         setArticleNotes((prevNotes) => ({ ...prevNotes, [article.title]: response.notes }));
    //     }).catch((error) => {
    //         console.log(error);
    //         throw new Error('Unable to generate notes. Please try again.');
    //     }).finally(() => {
    //         setIsGeneratingNotes(false);
    //     });
    // }


    return (
        <>
            {toastMessage && (
                <Toast toastKey={toastMessage} message={toastMessage} severity={toastSeverity} />
            )}
            <Header />
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto', marginTop: '0px' }}>
                <Grid item xs={12} sx={{ marginBottom: '0px' }}>
                    
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography variant="h4" component="h1">{!resourceLoadingMap.learningSession && session ? session.title : 'Loading...'}</Typography>
                        <Button variant="text" color="primary" onClick={() => navigate(-1)} sx={{ fontSize: '12px' }}>&lt; Back to All Sessions</Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', maxHeight: '32px' }}>
                        <Button variant="outlined" disabled={isLoading || isSorting || (articles.length === 0)} size="small" color="primary" sx={{ marginRight: '8px' }} onClick={handleSortArticles}>Sort Articles</Button>
                        <Button variant="outlined" size="small" color="secondary" onClick={handleModalOpen} disabled={isLoading || isSorting}>+ Add Article</Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                {!resourceLoadingMap.learningSession && loadingError && (
                    <Grid item xs={12}>
                        <Typography variant="body1" style={{ color: 'red' }}>Unable to load session: {loadingError.message}</Typography>
                    </Grid>
                )}

                {/* {!resourceLoadingMap.learningSession && session && (
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Summary:</strong> {session.summary || 'N/A'}</Typography>
                    </Grid>
                )} */}
            </Grid>
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                <Grid item xs={12}>
                    <Accordion
                        expanded={accordionExpanded.userArticles}
                        onChange={(event: React.SyntheticEvent, isExpanded: boolean) => {
                            setAccordionExpanded((prevExpanded) => ({ ...prevExpanded, userArticles: isExpanded }));
                        }}
                        sx={{ backgroundColor: '#f8f8f8' }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="user-articles-panel-content"
                            id="user-articles-panel-header"
                        >
                            <Typography variant="h5" component="h2">Articles {!resourceLoadingMap.articles && articles.length > 0 && (`(${articles.length})`)}</Typography>
                        </AccordionSummary>
                        <AccordionDetails id="user-articles-panel-content">
                            {resourceLoadingMap.articles && (
                                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                    <Typography variant="body1">Loading articles...</Typography>
                                </Grid>
                            )}

                            {!resourceLoadingMap.articles && articles.length > 0 && articles.map((article, index) => (
                                <Grid item xs={12} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Typography variant="body1" gutterBottom><a href={article.url}><strong>{index + 1}.</strong> {article.title}</a></Typography>
                                        {article.summary && (
                                            <Typography variant="body2" style={{ color: '#888' }}><strong>Summary: </strong>{article.summary}</Typography>
                                        )}
                                    </Box>
                                    {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
                                        <Button variant="outlined" color="primary" size="small" onClick={() => {
                                            if (!article.id) {
                                                setLoadingError(new Error('No article ID found.'));
                                            } else {
                                                handleGenerateNotes(article.id);
                                            }
                                        }}>
                                        Generate Notes
                                        </Button>
                                    </Box> */}
                                </Grid>
                            ))}

                            {!resourceLoadingMap.articles && articles.length === 0 && (
                                <Typography variant="body1" style={{ margin: '24px 0px', textAlign: 'center' }}>No articles have been added to this session. Use the "+ Add Article" button to start.</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto', marginBottom: '64px' }}>
                <Grid item xs={12}>
                    <Accordion
                        expanded={accordionExpanded.sortedArticles}
                        onChange={(event: React.SyntheticEvent, isExpanded: boolean) => {
                            setAccordionExpanded((prevExpanded) => ({ ...prevExpanded, sortedArticles: isExpanded }));
                        }}
                        sx={{ backgroundColor: '#f8f8f8' }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="sorted-articles-panel-content"
                            id="sorted-articles-panel-header"
                        >
                            <Typography variant="h5" component="h2">Sorted Articles</Typography>
                        </AccordionSummary>
                        <AccordionDetails id="sorted-articles-panel-content">
                            {isSorting && (
                                <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                        <CircularProgress size="24px" color="primary" />
                                    </Grid>
                                </Grid>
                            )}

                            {!isSorting && sortedArticles && sortedArticles?.sortedArticles.length > 0 && sortedArticles.sortedArticles.map((article, index) => {
                                let matchingArticle: Article | undefined = articles.find((userArticle) => userArticle.title === article.title);
                                if (!matchingArticle) {
                                    // Attempt to find the article by ID.
                                    matchingArticle = articles.find((userArticle) => userArticle.id === article.id);
                                }

                                if (!matchingArticle) {
                                    return null;
                                }

                                return (
                                    <Grid item xs={12} key={index} sx={{ marginBottom: '16px' }}>
                                        <Typography variant="body1" gutterBottom><strong>{article.sort}. <a href={matchingArticle.url} target='_blank' rel='noreferrer'>{article.title}</a></strong></Typography>
                                        <Typography variant="body2" gutterBottom><strong>Reasons: </strong>{article.reason}</Typography>
                                        <Typography variant="body2" gutterBottom><strong>Flow of Info: </strong>{article.informationFlow}</Typography>
                                    </Grid>
                                );
                            })}

                            {!isSorting && (!sortedArticles || sortedArticles?.sortedArticles.length === 0) && (
                                <Typography variant="body1" style={{ margin: '24px 0px', textAlign: 'center' }}>No articles have been sorted for this session.</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            {/* <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto', marginBottom: '64px' }}>
                <Grid item xs={12}>
                    <Accordion
                        expanded={accordionExpanded.userNotes}
                        onChange={(event: React.SyntheticEvent, isExpanded: boolean) => {
                            setAccordionExpanded((prevExpanded) => ({ ...prevExpanded, userNotes: isExpanded }));
                        }}
                        sx={{ backgroundColor: '#f8f8f8' }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="user-notes-panel-content"
                            id="user-notes-panel-header"
                        >
                            <Typography variant="h5" component="h2">Session Notes</Typography>
                        </AccordionSummary>
                        <AccordionDetails id="user-notes-panel-content">
                        <>
                            {(!resourceLoadingMap.notes && Object.keys(articleNotes).length > 0) ? (
                                Object.keys(articleNotes).map((articleTitle, index) => (
                                    <Grid item xs={12} key={index}>
                                        <div>
                                            <h3>{articleTitle}</h3>
                                            <ReactMarkdown>{articleNotes[articleTitle]}</ReactMarkdown>
                                        </div>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                    <Typography variant="body1" style={{ color: '#888' }}>No notes taken for any articles in the session.</Typography>
                                </Grid>
                            )}        
                        </>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid> */}

            <Modal open={isModalOpen} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <>
                    {resourceLoadingMap.addArticle && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 9999
                            }}
                        >
                            <CircularProgress color="primary" />
                        </div>
                    )}
                    <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h3" gutterBottom>Add Medium Article</Typography>
                            <Typography variant="body1" component="p" gutterBottom>By copying-and-pasting the URL below of the Medium article that you are interested in, you can import it into your learning session.</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="URL"
                                name="url"
                                value={newArticle.url}
                                onChange={handleNewArticleChange}
                            />
                        </Grid>
                        
                        {addArticleSuccessMessage && (
                            <Grid item xs={12}>
                                <Typography variant="body1" style={{ color: 'green' }}>{addArticleSuccessMessage}</Typography>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleNewArticleSubmit} disabled={!newArticle.url}>
                                Add Article
                            </Button>
                        </Grid>
                    </Grid>
                </>
            </Modal>
        </>
    );
};

export default SessionDetailsPage;