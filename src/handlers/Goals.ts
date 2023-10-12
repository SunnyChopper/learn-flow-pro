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
    console.log("🚀 ~ file: Goals.ts:15 ~ getGoalsHandler ~ event:", event);
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

export const updateGoalHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return buildResponse(event, 400, { message: 'Invalid request body.' });
    }

    const goal = JSON.parse(event.body) as Goal;
    const goalsService = new GoalsService();
    const updatedGoal = await goalsService.updateGoal(goal);
    return buildResponse(event, 200, updatedGoal);
}

export const deleteGoalHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("🚀 ~ file: Goals.ts:37 ~ deleteGoalHandler ~ event.queryStringParameters:", event.queryStringParameters)
    if (!event.queryStringParameters?.goalId) {
        return buildResponse(event, 400, { message: 'Invalid goal id.' });
    }

    const goalId = parseInt(event.queryStringParameters.goalId);
    const goalsService = new GoalsService();
    await goalsService.deleteGoal(goalId);
    return buildResponse(event, 200, { message: 'Goal deleted.' });
}