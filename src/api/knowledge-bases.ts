// System
import { Auth } from 'aws-amplify';

// Entities
import { KnowledgeBaseEntry } from 'src/entity/KnowledgeBaseEntry';
import { KnowledgeBase } from 'src/entity/KnowledgeBase';
import { Article } from 'src/entity/Article';

// Utils
import { getCurrentUserId, getCurrentUserJwtToken } from 'src/utils/auth';

export const createKnowedgeBaseForUser = async (knowledgeBase: KnowledgeBase) => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/knowledge-bases`, {
        method: 'POST',
        body: JSON.stringify({
            userId: await getCurrentUserId(),
            title: knowledgeBase.title,
            description: knowledgeBase.description
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create knowledge base. Error: ${response.status}`);
    }

    return await response.json() as KnowledgeBase;
}

export const createKnowledgeBaseEntryForUser = async (knowledgeBaseEntry: KnowledgeBaseEntry) => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/knowledge-bases/entries`, {
        method: 'POST',
        body: JSON.stringify({
            userId: await getCurrentUserId(),
            knowledgeBaseId: knowledgeBaseEntry.knowledgeBaseId,
            articleId: knowledgeBaseEntry.articleId
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create knowledge base entry. Error: ${response.status}`);
    }

    return await response.json() as KnowledgeBaseEntry;
}           

export const fetchKnowledgeBasesForUser = async (): Promise<KnowledgeBase[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/knowledge-bases`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get knowledge bases for the current user. Error: ${response.status}`);
    }

    return await response.json() as KnowledgeBase[];
}

export const fetchKnowledgeBaseForUser = async (knowledgeBaseId: number): Promise<KnowledgeBase> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/knowledge-bases?knowledgeBaseId=${knowledgeBaseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get knowledge base. Error: ${response.status}`);
    }

    return await response.json() as KnowledgeBase;
}

export const fetchArticlesForKnowledgeBase = async (knowledgeBaseId: number): Promise<Article[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/knowledge-bases/articles?knowledgeBaseId=${knowledgeBaseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get articles for the knowledge base. Error: ${response.status}`);
    }

    return await response.json() as Article[];
}
