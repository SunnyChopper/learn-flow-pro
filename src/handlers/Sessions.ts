// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Entity
import { LearningSession } from 'src/entity/LearningSession';
import { Article } from 'src/entity/Article';
import { Note } from 'src/entity/Note';

// Services
import LearningSessionService from '/opt/services/LearningSessionService';

import ArticleService from '/opt/services/ArticleService';
import NotesService from '/opt/services/NotesService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';
import { getOpenAIApiKey } from 'src/utils/secrets';

export const getSessionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let sessionId: number;
    try {
        sessionId = parseInt(event.queryStringParameters?.sessionId as string);
        if (!sessionId) {
            return buildResponse(event, 400, { message: 'Invalid session id.' });
        }
    } catch (error) {
        return buildResponse(event, 400, { message: 'Invalid session id.' });
    }

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const sessionService = new LearningSessionService(openAIApiKey);
    try {
        const session = await sessionService.getSession(userId, sessionId);
        return buildResponse(event, 200, session);
    } catch (error) {
        return buildResponse(event, 500, { message: `Error getting session: ${error}` });
    }
}

export const getUserSessionsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const sessionService = new LearningSessionService(openAIApiKey);
    const sessions = await sessionService.getSessions(userId);
    return buildResponse(event, 200, sessions);
}

export const getNotesForLearningSessionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const sessionId: string | undefined = event.queryStringParameters?.sessionId;
    if (!sessionId) {
        return buildResponse(event, 400, { message: 'Invalid session id.' });
    }

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const articlesService: ArticleService = new ArticleService(openAIApiKey, "openai", "gpt-3.5-turbo-16k", "precise");
    const articles: Article[] = await articlesService.getArticlesForSession(parseInt(sessionId));
    if (articles.length === 0) {
        return buildResponse(event, 200, []);
    }

    const notesService: NotesService = new NotesService();
    const notes: Note[] = await notesService.getNotesForArticles(articles.map(article => (article.id as number)));
    return buildResponse(event, 200, notes);
}

export const createSessionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const session = JSON.parse(event.body) as LearningSession;
    const sessionService = new LearningSessionService(openAIApiKey);
    const newSession = await sessionService.createSession(session);
    return buildResponse(event, 200, newSession);
}