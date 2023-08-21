// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Entity
import { KnowledgeBaseEntry } from 'src/entity/KnowledgeBaseEntry';
import { KnowledgeBase } from 'src/entity/KnowledgeBase';

// Services
import KnowledgeBaseService from '/opt/services/KnowledgeBaseService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const getKnowledgeBasesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    const knowledgeBaseService = new KnowledgeBaseService();
    const knowledgeBases = await knowledgeBaseService.getKnowledgeBasesForUser(userId);
    return buildResponse(event, 200, knowledgeBases);
}

export const getKnowledgeBaseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let knowledgeBaseId: number | null = event.pathParameters?.knowledgeBaseId ? parseInt(event.pathParameters.knowledgeBaseId) : null;
    if (!knowledgeBaseId) {
        return buildResponse(event, 400, { message: 'Invalid knowledge base id.' });
    }

    const knowledgeBaseService = new KnowledgeBaseService();
    const knowledgeBase = await knowledgeBaseService.getKnowledgeBase(userId, knowledgeBaseId);
    return buildResponse(event, 200, knowledgeBase);
}

export const getArticlesForKnowledgeBaseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let knowledgeBaseId: number | null = event.pathParameters?.knowledgeBaseId ? parseInt(event.pathParameters.knowledgeBaseId) : null;
    if (!knowledgeBaseId) {
        return buildResponse(event, 400, { message: 'Invalid knowledge base id.' });
    }

    const knowledgeBaseService = new KnowledgeBaseService();
    const knowledgeBase = await knowledgeBaseService.getArticlesForKnowledgeBase(knowledgeBaseId);
    return buildResponse(event, 200, knowledgeBase);
}

export const createKnowledgeBaseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const knowledgeBase = JSON.parse(event.body) as KnowledgeBase;
    const knowledgeBaseService = new KnowledgeBaseService();
    const newKnowledgeBase = await knowledgeBaseService.createKnowledgeBase(knowledgeBase);
    return buildResponse(event, 200, newKnowledgeBase);
}

export const createKnowledgeBaseEntryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const knowledgeBaseEntry = JSON.parse(event.body) as KnowledgeBaseEntry;
    const knowledgeBaseService = new KnowledgeBaseService();
    const newKnowledgeBaseEntry = await knowledgeBaseService.createKnowledgeBaseEntry(knowledgeBaseEntry);
    return buildResponse(event, 200, newKnowledgeBaseEntry);
}