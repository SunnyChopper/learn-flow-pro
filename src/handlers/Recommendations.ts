// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Entity
import { Recommendation } from 'src/entity/Recommendation';

// Services
import RecommendationService from '/opt/services/RecommendationService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const generateTopicRecommendationsHandler= async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    const recommendationService = new RecommendationService("openai", "gpt-3.5-turbo", "creative");
    const recommendations: { topics: string[] } = await recommendationService.generateTopicRecommendationsUsingArticles(userId);
    return buildResponse(event, 200, recommendations);
}

export const getRecommendationsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }

    const recommendationService = new RecommendationService("openai", "gpt-3.5-turbo", "creative");
    const recommendations: Recommendation[] = await recommendationService.readRecommendationsForUser(userId);
    return buildResponse(event, 200, recommendations);
}
