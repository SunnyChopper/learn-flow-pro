// System
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Auth } from 'aws-amplify';
import moment from 'moment';

// Material UI
import { Grid, Button, Modal, TextField, Typography, CircularProgress, Divider } from '@mui/material';

// Components
import Header from 'src/components/organisms/Header';

// API
import {
    createArticleForSession,
    fetchArticlesForSession,
    sortArticlesForSession,
    generateNotesForArticle
} from 'src/api/articles';
import { fetchLearningSession } from 'src/api/sessions';

// Contracts
import { SortedArticles } from 'src/contracts/SortArticles';

// Entities
import { LearningSession } from 'src/entity/LearningSession';
import { Article } from 'src/entity/Article';


interface ArticleInput {
    title: string;
    url: string;
    authors?: string;
}

interface SessionDetailsPageProps {

}

const SessionDetailsPage: React.FC<SessionDetailsPageProps> = () => {
    const params = useParams<{ sessionId: string }>();

    // Data fetching
    const [isGeneratingNotes, setIsGeneratingNotes] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<Error | null>(null);
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSorting, setIsSorting] = useState<boolean>(false);

    // Create modal
    const [newArticle, setNewArticle] = useState<ArticleInput>({ title: '', url: '', authors: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Data
    const [articleNotes, setArticleNotes] = useState<{ [key: string]: string }>({});
    const [sortedArticles, setSortedArticles] = useState<SortedArticles | null>(null);
    const [session, setSession] = useState<LearningSession | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => { 
        if (params.sessionId && !hasMounted) {
            setIsLoading(true);
            fetchLearningSession(parseInt(params.sessionId)).then((response) => {
                console.log(response);
                if (!response.id) {
                    throw new Error('Session ID not found.');
                }

                setSession(response);
                fetchArticles(response.id).then(() => {
                    console.log('Articles fetched.');
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    setIsLoading(false);
                    setHasMounted(true);
                });
            }).catch((error) => {
                console.log(error);
                setIsLoading(false);
                setLoadingError(error);
            });
        }
    }, [params.sessionId, hasMounted]);

    const fetchArticles = async (sessionId?: number) => {
        if ((!sessionId && session && session.id) || (sessionId)) {
            const id = sessionId || session?.id;
            if (!id) {
                throw new Error('Session ID not found. Cannot fetch articles.');
            }

            try {
                const articles: Article[] = await fetchArticlesForSession(id);
                setArticles(articles);
            } catch (error) {
                console.log(error);
                throw new Error('Unable to fetch articles. Please try again.');
            }
        }
    }

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
        articleToCreate.title = newArticle.title;
        articleToCreate.url = newArticle.url;
        articleToCreate.authors = newArticle.authors;

        createArticleForSession(articleToCreate).then((response) => {
            console.log(response);
            fetchArticles();
        }).catch((error) => {
            console.log(error);
            throw new Error('Unable to create article. Please try again.');
        });

        setNewArticle({ title: '', url: '', authors: '' });
        setIsModalOpen(false);
    };

    const handleSortArticles = async () => {
        if (!session || !session.id) {
            throw new Error('Session ID not found. Cannot sort articles.');
        }

        setIsSorting(true);
        sortArticlesForSession(session.id).then((response: SortedArticles) => {
            console.log(response);
            setSortedArticles(response);
            fetchArticles();
        }).catch((error) => {
            console.log(error);
            throw new Error('Unable to sort articles. Please try again.');
        }).finally(() => {
            setIsSorting(false);
        });
    };

    const handleGenerateNotes = async (articleId: number) => {
        const article: Article | undefined = articles.find((article) => article.id === articleId);
        if (!article) { throw new Error('Article not found. Cannot generate notes.'); }

        setIsGeneratingNotes(true);
        generateNotesForArticle(articleId).then((response) => {
            console.log(response);
            setArticleNotes((prevNotes) => ({ ...prevNotes, [article.title]: response.notes }));
        }).catch((error) => {
            console.log(error);
            throw new Error('Unable to generate notes. Please try again.');
        }).finally(() => {
            setIsGeneratingNotes(false);
        });
    }


    return (
        <>
            <Header />
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '48px' }}>
                    <Typography variant="h4" component="h1">Session Details</Typography>
                    <Button variant="outlined" color="primary" onClick={handleModalOpen}>+ Add Article</Button>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                {isLoading && (
                    <Grid item xs={12}>
                        <CircularProgress size="48px" color="primary" />
                    </Grid>
                )}

                {!isLoading && loadingError && (
                    <Grid item xs={12}>
                        <Typography variant="body1" style={{ color: 'red' }}>Unable to load session: {loadingError.message}</Typography>
                    </Grid>
                )}

                {!isLoading && session && (
                    <Grid item xs={12}>
                        <Typography variant="h6"><strong>Name:</strong> {session.title}</Typography>
                        <Typography variant="body1"><strong>Summary:</strong> {session.summary || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Created:</strong> {moment(session.createdAt).format('MMM Do, YYYY')}</Typography>
                    </Grid>
                )}
            </Grid>
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                <Grid item xs={12} style={{ backgroundColor: '#f8f8f8', marginTop: '32px', borderRadius: '12px', boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.25)' }}>
                    <Typography variant="h5" component="h2">Articles</Typography>

                    {isLoading && (
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                            <Typography variant="body1">Loading articles...</Typography>
                        </Grid>
                    )}
                    
                    {!isLoading && articles.length > 0 && articles.map((article, index) => (
                        <Grid item xs={12} key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '8px' }}>
                            <Typography variant="body1"><a href={article.url}><strong>{index + 1}.</strong> {article.title}</a></Typography>
                            <Button variant="outlined" color="primary" size="small" onClick={() => {
                                if (!article.id) {
                                    setLoadingError(new Error('No article ID found.'));
                                } else {
                                    handleGenerateNotes(article.id);
                                }
                            }}>
                                Generate Notes
                            </Button>
                        </Grid>
                    ))}

                    {!isLoading && articles.length === 0 && (
                        <Typography variant="body1" style={{ margin: '24px 0px', textAlign: 'center' }}>No articles have been added to this session. Use the "+ Add Article" button to start.</Typography>
                    )}
                </Grid>
            </Grid>
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                    <Button variant="contained" disabled={isLoading || isSorting} color="primary" onClick={handleSortArticles}>Sort Articles</Button>
                </Grid>
            </Grid>

            {sortedArticles && (
                <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                    <Grid item xs={12} style={{ backgroundColor: '#f8f8f8', marginTop: '32px', borderRadius: '12px', boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.25)' }}>
                        <Typography variant="h5" component="h2">Sorted Articles</Typography>

                        {isSorting && (
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                <CircularProgress size="24px" color="primary" />
                            </Grid>
                        )}
                        
                        {!isSorting && sortedArticles?.articles.length > 0 && sortedArticles.articles.map((article, index) => {
                            let reasons: string;
                            if (article.reasons) {
                                reasons = article.reasons.join(', ');
                            } else {
                                reasons = 'N/A';
                            }

                            return (
                                <Grid item xs={12} key={index}>
                                    <div>
                                        <h3>{article.title}</h3>
                                        <p>{reasons}</p>
                                    </div>
                                </Grid>
                            );
                        })}

                        {!isSorting && sortedArticles?.articles.length === 0 && (
                            <Typography variant="body1" style={{ margin: '24px 0px', textAlign: 'center' }}>No articles have been sorted for this session.</Typography>
                        )}
                    </Grid>
                </Grid>
            )}

            {isGeneratingNotes && (
                <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                        <CircularProgress size="24px" color="primary" />
                    </Grid>
                </Grid>
            )}

            {!isGeneratingNotes && Object.keys(articleNotes).length > 0 && (
                <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                    <Grid item xs={12} style={{ backgroundColor: '#f8f8f8', marginTop: '32px', borderRadius: '12px', boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.25)' }}>
                        <Typography variant="h5" component="h2">Article Notes</Typography>

                        {Object.keys(articleNotes).map((articleTitle, index) => (
                            <Grid item xs={12} key={index}>
                                <div>
                                    <h3>{articleTitle}</h3>
                                    <ReactMarkdown>{articleNotes[articleTitle]}</ReactMarkdown>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}

            <Modal open={isModalOpen} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h3" gutterBottom>Add Article</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Title"
                            name="title"
                            value={newArticle.title}
                            onChange={handleNewArticleChange}
                        />
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
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Authors"
                            name="authors"
                            value={newArticle.authors}
                            onChange={handleNewArticleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleNewArticleSubmit} disabled={!newArticle.title || !newArticle.url}>
                            Add Article
                        </Button>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
};

export default SessionDetailsPage;