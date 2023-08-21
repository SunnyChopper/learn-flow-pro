// System
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

// Material UI
import { Grid, Button, Modal, Select, Typography, CircularProgress, Divider } from '@mui/material';

// Components
import Header from 'src/components/organisms/Header';

// API
import { fetchArticlesForKnowledgeBase, fetchKnowledgeBaseForUser, createKnowledgeBaseEntryForUser } from 'src/api/knowledge-bases';
import { fetchArticlesForUser } from 'src/api/articles';


// Entities
import { KnowledgeBaseEntry } from 'src/entity/KnowledgeBaseEntry';
import { KnowledgeBase } from 'src/entity/KnowledgeBase';
import { Article } from 'src/entity/Article';

interface KnowledgeBaseDetailsPageProps {

}

const KnowledgeBaseDetailsPage: React.FC<KnowledgeBaseDetailsPageProps> = () => {
    const params = useParams<{ knowledgeBaseId: string }>();

    // Data fetching
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string>('');
    const [addError, setAddError] = useState<string>('');
    // Create modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newArticle, setNewArticle] = useState<Article>({} as Article);
    // Loaded data
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | undefined>(undefined);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        if (params.knowledgeBaseId && !hasMounted) {
            setIsLoading(true);
            fetchKnowledgeBaseForUser(parseInt(params.knowledgeBaseId)).then((knowledgeBase) => {
                setKnowledgeBase(knowledgeBase);

                fetchArticlesForKnowledgeBase(parseInt(params.knowledgeBaseId as string)).then((articles) => {
                    setArticles(articles);

                    fetchArticlesForUser().then((allArticles) => {
                        setAllArticles(allArticles);
                    }).catch((error) => {
                        console.log(error);
                        setLoadError(`Error loading articles: ${error}`);
                    }).finally(() => {
                        setIsLoading(false);
                        setHasMounted(true);
                    });
                }).catch((error) => {
                    console.log(error);
                    setLoadError(`Error loading knowledge base with ID ${params.knowledgeBaseId}: ${error}`);
                    setIsLoading(false);
                });
            }).catch((error) => {
                console.log(error);
                setLoadError(`Error loading knowledge base with ID ${params.knowledgeBaseId}: ${error}`);
                setIsLoading(false);
            });
        }
    }, []);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddingArticle = async () => {
        setAddError('');
        if (!newArticle || !newArticle.id) {
            setAddError('Please select an article to add.');
            return;
        }

        if (!knowledgeBase?.id) {
            setAddError('No knowledge base ID found.');
            return;
        }

        setIsAdding(true);
        let newEntry: KnowledgeBaseEntry | undefined;
        try {
            newEntry = await createKnowledgeBaseEntryForUser({ knowledgeBaseId: knowledgeBase?.id, articleId: newArticle.id });
        } catch (error: any) {
            setAddError(error.message);
        } finally {
            setIsAdding(false);
            if (newEntry) {
                setIsLoading(true);
                fetchArticlesForKnowledgeBase(knowledgeBase.id).then((articles) => {
                    setArticles(articles);
                }).catch((error) => {
                    console.log(error);
                    setLoadError(`Error loading knowledge base with ID ${params.knowledgeBaseId}: ${error}`);
                }).finally(() => {
                    setNewArticle({} as Article);
                    setIsModalOpen(false);
                    setIsLoading(false);
                });
            }
        }
    }

    const renderArticlesSelect = () => {
        return (
            <Select
                native
                value={newArticle.id}
                onChange={(event) => {
                    const articleId = parseInt(event.target.value as string);
                    const article = allArticles.find((article) => article.id === articleId);
                    if (article) {
                        setNewArticle(article);
                    }
                }}
                inputProps={{
                    name: 'article',
                    id: 'article-select',
                }}
            >
                {allArticles.map((article, index) => {
                    // Only return if the article is not already in the knowledge base
                    if (!articles.find((a) => a.id === article.id)) {
                        return (
                            <option key={index} value={article.id}>{article.title}</option>
                        );
                    }
                })}
            </Select>
        );
    }

    return (
        <>
            <Header />
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '48px' }}>
                    <Typography variant="h4" component="h1">Knowledge Base Details</Typography>
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

                {!isLoading && knowledgeBase && (
                    <Grid item xs={12}>
                        <Typography variant="h6"><strong>Name:</strong> {knowledgeBase.title}</Typography>
                        <Typography variant="body1"><strong>Description:</strong> {knowledgeBase.description}</Typography>
                        <Typography variant="body1"><strong>Created:</strong> {moment(knowledgeBase.createdAt).format('MMM Do, YYYY')}</Typography>
                    </Grid>
                )}
            </Grid>
            <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto' }}>
                <Grid item xs={12} style={{ backgroundColor: '#f8f8f8', marginTop: '32px', borderRadius: '12px', boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.25)' }}>
                    <Typography variant="h5" component="h2">Articles</Typography>

                    {isLoading && (
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                            <CircularProgress size="24px" color="primary" />
                        </Grid>
                    )}
                    
                    {!isLoading && articles.length > 0 && articles.map((article, index) => (
                        <Grid item xs={12} key={index}>
                            <div>
                                <h3><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h3>
                                {article.authors && <p>Author: {article.authors}</p>}
                            </div>
                        </Grid>
                    ))}

                    {!isLoading && articles.length === 0 && (
                        <Typography variant="body1" style={{ margin: '24px 0px', textAlign: 'center' }}>No articles have been added to this knowledge base. Use the "+ Add Article" button to start.</Typography>
                    )}
                </Grid>
            </Grid>

            <Modal open={isModalOpen} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid container spacing={2} maxWidth="md" style={{ margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h3" gutterBottom>Add Article</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="p" gutterBottom>Choose an article to import from the list below:</Typography>
                        {renderArticlesSelect()}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddingArticle} disabled={!newArticle.title || !newArticle.url}>
                            Add Article
                        </Button>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
};

export default KnowledgeBaseDetailsPage;