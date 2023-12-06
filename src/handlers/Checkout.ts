// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Services
import StripeService from "/opt/services/StripeService";

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const createCheckoutSessionHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string | undefined = await getUserId(event);
    if (!userId) {
        return buildResponse(event, 400, { message: 'Invalid user id.' });
    }
    
    const priceId = event.queryStringParameters?.priceId;
    if (!priceId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing priceId query parameter" })
        };
    }

    const stripeService = new StripeService();
    try {
        const session = await stripeService.createCheckoutSession(userId, priceId);
        return buildResponse(event, 200, { sessionId: session.id });
    } catch (error) {
        console.log('Error creating checkout session', error);
        return buildResponse(event, 500, { error: error });
    }
};

export const stripeWebhooksHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const stripeService = new StripeService();
    try {
        console.log("🚀 ~ file: Checkout.ts:38 ~ stripeWebhooksHandler ~ JSON.parse(event.body as string):", JSON.parse(event.body as string))
        await stripeService.handleWebhookEvent(JSON.parse(event.body as string));
        return buildResponse(event, 200, { message: 'Webhook event handled' });
    } catch (error) {
        console.log('Error handling webhook event', error);
        return buildResponse(event, 500, { error: error });
    }
}