// System
import { Auth } from 'aws-amplify';

// Entities
import { Article } from 'src/entity/Article';
import { Note } from 'src/entity/Note';

// Contracts
import { SortedArticles } from 'src/contracts/SortArticles';

// Utils
import { getCurrentUserId, getCurrentUserJwtToken } from 'src/utils/auth';

export const sortArticlesForSession = async (sessionId: number): Promise<SortedArticles> => { 
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sessions/sort`, {
        method: 'POST',
        body: JSON.stringify({
            sessionId: sessionId
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create article. Error: ${response.status}`);
    }

    return await response.json() as SortedArticles;
}

export const generateSummaryForArticle = async (articleId: number): Promise<{ summary: string }> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/articles/summary`, {
        method: 'POST',
        body: JSON.stringify({
            articleId: articleId
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create article. Error: ${response.status}`);
    }

    return await response.json() as { summary: string };
}

export const generateNotesForArticle = async (articleId: number): Promise<{ notes: string }> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/articles/notes`, {
        method: 'POST',
        body: JSON.stringify({
            articleId: articleId
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create article. Error: ${response.status}`);
    }

    return await response.json() as { notes: string };
}

export const createArticleForSession = async (article: Article) => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/articles`, {
        method: 'POST',
        body: JSON.stringify({
            userId: await getCurrentUserId(),
            sessionId: article.sessionId,
            title: article.title,
            url: article.url,
            summary: article.summary,
            authors: article.authors
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create article. Error: ${response.status}`);
    }

    return await response.json() as Article;
}

export const fetchArticlesForSession = async (sessionId: number): Promise<Article[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
    };

    const apiPath = `${process.env.REACT_APP_API_BASE_URL}/articles?sessionId=${sessionId}`;
    const response = await fetch(apiPath, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Failed to get articles for a session. Error: ${response.status}`);
    }

    return await response.json() as Article[];
}

export const fetchArticlesForUser = async (): Promise<Article[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
    };

    const apiPath = `${process.env.REACT_APP_API_BASE_URL}/articles`;
    const response = await fetch(apiPath, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Failed to get articles for the current user. Error: ${response.status}`);
    }

    return await response.json() as Article[];
}

export const fetchNotesForArticle = async (articleId: number): Promise<Note[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/articles/notes?articleId=${articleId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get notes for article. Error: ${response.status}`);
    }

    return await response.json() as Note[];
}

export const fetchNotesForSession = async (sessionId: number): Promise<Note[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sessions/notes?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get notes for article. Error: ${response.status}`);
    }

    return await response.json() as Note[];
}