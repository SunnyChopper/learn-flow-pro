// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Entity
import { Goal } from 'src/entity/Goal';

// Services
import GoalsService from '/opt/services/GoalsService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const getGoalsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    const goalsService = new GoalsService();
    const goals = await goalsService.getGoalsForUser(userId);
    return buildResponse(event, 200, goals);
}

export const createGoalHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const goal = JSON.parse(event.body) as Goal;
    const goalsService = new GoalsService();
    const newGoal = await goalsService.createGoal(goal);
    return buildResponse(event, 200, newGoal);
}