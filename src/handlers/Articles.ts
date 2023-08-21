// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Entity
import { Article } from 'src/entity/Article';

// Services
import LearningSessionService from '/opt/services/LearningSessionService';
import ArticleService from '/opt/services/ArticleService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const sortArticlesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let sessionId: number | null = event.body ? JSON.parse(event.body).sessionId : null;
    if (!sessionId) {
        return buildResponse(event, 400, { message: 'Invalid session id.' });
    }

    const sessionService: LearningSessionService = new LearningSessionService();
    const sortedArticles = await sessionService.sortArticlesByRelevance(userId, sessionId);
    return buildResponse(event, 200, sortedArticles);
}

export const generateNotesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let articleId: number | null = event.body ? JSON.parse(event.body).articleId : null;
    if (!articleId) {
        return buildResponse(event, 400, { message: 'Invalid article id.' });
    }

    const articleService: ArticleService = new ArticleService("openai", "gpt-3.5-turbo-16k", "precise");
    const notes: string = await articleService.generateNotesForArticleMarkdown(userId, articleId);
    return buildResponse(event, 200, { notes: notes });
}

export const getArticlesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let sessionId: number | null = event.pathParameters?.sessionId ? parseInt(event.pathParameters.sessionId) : null;
    if (sessionId) {
        const articleService = new ArticleService();
        const articles = await articleService.getArticlesForSession(sessionId);
        return buildResponse(event, 200, articles);
    } else {
        const articleService = new ArticleService();
        const articles = await articleService.getArticlesForUser(userId);
        return buildResponse(event, 200, articles);
    }
}

export const createArticleHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const article = JSON.parse(event.body) as Article;
    const articleService = new ArticleService();
    const newArticle = await articleService.createArticle(article);
    return buildResponse(event, 200, newArticle);
}