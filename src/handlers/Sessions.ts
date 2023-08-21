// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Entity
import { LearningSession } from 'src/entity/LearningSession';

// Services
import LearningSessionService from '/opt/services/LearningSessionService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const getSessionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    let sessionId: number;
    try {
        sessionId = parseInt(event.pathParameters?.id || '');
        if (!sessionId) {
            return buildResponse(event, 400, { message: 'Invalid session id.' });
        }
    } catch (error) {
        return buildResponse(event, 400, { message: 'Invalid session id.' });
    }

    const sessionService = new LearningSessionService();
    const session = await sessionService.getSession(userId, sessionId);
    return buildResponse(event, 200, session);
}

export const getSessionsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    const sessionService = new LearningSessionService();
    const sessions = await sessionService.getSessions(userId);
    return buildResponse(event, 200, sessions);
}

export const createSessionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const session = JSON.parse(event.body) as LearningSession;
    const sessionService = new LearningSessionService();
    const newSession = await sessionService.createSession(session);
    return buildResponse(event, 200, newSession);
}