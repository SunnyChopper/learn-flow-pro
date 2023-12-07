// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';

// Entity
import { Article } from 'src/entity/Article';
import { Note } from 'src/entity/Note';

// Services
import LearningSessionService from '/opt/services/LearningSessionService';
import ArticleService from '/opt/services/ArticleService';
import MediumService from '/opt/services/MediumService';
import NotesService from '/opt/services/NotesService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';
import { getOpenAIApiKey } from 'src/utils/secrets';

import { SortedArticles } from 'src/contracts/SortArticles';

export const invokeSortingArticlesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    // Delete any existing sorting results for this user
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1',
        endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
    });

    const deleteParams = {
        TableName: 'learnflow-pro-sorting-results',
        Key: {
            sessionId: event.body ? JSON.parse(event.body).sessionId : null
        }
    };

    try {
        await docClient.delete(deleteParams).promise();
    } catch (error) {
        console.log("Error deleting existing sorting results: ", error);
        return buildResponse(event, 500, { message: `Error deleting existing sorting results. ${error}` });
    }

    // Invoke another Lambda to sort articles
    const lambda = new AWS.Lambda({
        region: 'us-east-1',
        endpoint: process.env.IS_OFFLINE ? 'http://localhost:3002' : undefined
    });

    const params: AWS.Lambda.InvocationRequest = {
        FunctionName: 'learnflow-pro-dev-sortArticlesProcessor',
        InvocationType: 'Event',
        Payload: JSON.stringify({
            userId: userId,
            sessionId: event.body ? JSON.parse(event.body).sessionId : null,
            articles: event.body ? JSON.parse(event.body).articles : null
        })
    };

    try {
        await lambda.invoke(params).promise();
        return buildResponse(event, 200, { success: true });
    } catch (error) {
        console.log("Error invoking sort articles processor: ", error);
        return buildResponse(event, 500, { success: false, message: `Error invoking sort articles processor. ${error}` });
    }
}

export const sortArticlesHandler = async (event: { userId: string, sessionId: number, articles: Article[] }, context: any): Promise<void> => {
    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        console.error("Error connecting to secrets manager: ", error);
        return;
    }

    const sessionService: LearningSessionService = new LearningSessionService(openAIApiKey, "openai", "gpt-4-1106-preview", "precise");
    const sortedArticles = await sessionService.sortArticlesByRelevance(event.userId, event.sessionId, event.articles);

    // Save the results to DynamoDB for polling
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1',
        endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
    });

    const params = {
        TableName: 'learnflow-pro-sorting-results',
        Item: {
            requestId: context.awsRequestId,
            userId: event.userId,
            sessionId: event.sessionId,
            sortedArticles: sortedArticles
        }
    };

    await docClient.put(params).promise();
}

export const pollForSortedArticlesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const sessionId: number | null = event.queryStringParameters?.sessionId ? parseInt(event.queryStringParameters.sessionId) : null;
    if (!sessionId) {
        return buildResponse(event, 400, { message: 'Invalid session id.' });
    }

    // Poll DynamoDB for the results
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1',
        endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
    });

    const params = {
        TableName: 'learnflow-pro-sorting-results',
        KeyConditionExpression: 'sessionId = :sessionId',
        ExpressionAttributeValues: {
            ':sessionId': sessionId
        },
        Limit: 1,
        ScanIndexForward: false
    };

    let response: AWS.DynamoDB.DocumentClient.QueryOutput;
    try {
        response = await docClient.query(params).promise();
        if (!response.Items || response.Items.length === 0) {
            return buildResponse(event, 202, { message: 'Sorting articles is still in progress.' });
        }

        const sortedArticles = response.Items[0].sortedArticles as SortedArticles;
        return buildResponse(event, 200, sortedArticles);
    } catch (error: any) {
        // If the error is because there were no results, then we'll
        // return a message saying that the Lambda is still processing.
        // If there truly is nothing there, then the frontend polling
        // will eventually timeout anyways.
        if (error.code === 'ResourceNotFoundException') {
            return buildResponse(event, 202, { message: 'Sorting articles is still in progress.' });
        } else {
            console.log("Error getting sorted articles: ", error);
            return buildResponse(event, 500, { message: `Error getting sorted articles. ${error}` });
        }
    }
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

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const articleService: ArticleService = new ArticleService(openAIApiKey, "openai", "gpt-3.5-turbo-16k", "precise");
    const notes: string = await articleService.generateNotesForArticleMarkdown(userId, articleId);
    return buildResponse(event, 200, { notes: notes });
}

export const generateSummaryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let articleId: number | null = event.body ? JSON.parse(event.body).articleId : null;
    if (!articleId) {
        return buildResponse(event, 400, { message: 'Invalid article id.' });
    }

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const useCache: boolean = event.body && JSON.parse(event.body).useCache !== undefined ? JSON.parse(event.body).useCache : true;
    const articleService: ArticleService = new ArticleService(openAIApiKey, "openai", "gpt-3.5-turbo-16k", "precise");
    const summary: string = await articleService.generateSummaryForArticle(userId, articleId, useCache);
    return buildResponse(event, 200, { summary: summary });
}

export const getNotesForArticleHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const articleId = event.queryStringParameters?.articleId ? parseInt(event.queryStringParameters.articleId) : null;
    if (!articleId) {
        return buildResponse(event, 400, { message: 'Invalid article id.' });
    }

    const notesService: NotesService = new NotesService();
    const notes: Note[] = await notesService.getNotesForArticle(articleId);
    return buildResponse(event, 200, notes);
}

export const getArticlesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let sessionId: number | null = event.queryStringParameters?.sessionId ? parseInt(event.queryStringParameters.sessionId) : null;
    console.log("🚀 ~ file: Articles.ts:213 ~ getArticlesHandler ~ sessionId:", sessionId)

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
        console.log("🚀 ~ file: Articles.ts:217 ~ getArticlesHandler ~ openAIApiKey:", openAIApiKey)
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    let articles: Article[] = [];
    const articleService = new ArticleService(openAIApiKey);
    if (sessionId) {
        try {
            articles = await articleService.getArticlesForSession(sessionId);
        } catch (error) {
            console.log("Error getting articles: ", error);
            return buildResponse(event, 500, { message: `Error getting articles. ${error}` });
        }
    } else {
        try {
            articles = await articleService.getArticlesForUser(userId);
        } catch (error) {
            console.log("Error getting articles: ", error);
            return buildResponse(event, 500, { message: `Error getting articles. ${error}` });
        }
    }

    return buildResponse(event, 200, articles);
}

export const createArticleHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const article = JSON.parse(event.body) as Article;
    const mediumService = new MediumService();
    try {
        const articleTitle = await mediumService.getTitleForArticle(article);
        article.title = articleTitle;
    } catch (error) {
        console.log("Error getting title for article: ", error);
    }

    try {
        const articleAuthor = await mediumService.getAuthorForArticle(article);
        article.authors = articleAuthor;
    } catch (error) {
        console.log("Error getting author for article: ", error);
    }

    let openAIApiKey: string;
    try {
        openAIApiKey = await getOpenAIApiKey();
    } catch (error) {
        return buildResponse(event, 500, { message: 'Error connecting to secrets manager.' });
    }

    const articleService = new ArticleService(openAIApiKey);
    const newArticle = await articleService.createArticle(article);
    return buildResponse(event, 200, newArticle);
}