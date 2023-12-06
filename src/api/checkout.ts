// Util
import { getCurrentUserJwtToken } from 'src/utils/auth';

export const createCheckoutSession = async (priceId: string): Promise<{ sessionId: string }> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    let response: Response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/create-checkout-session?priceId=${priceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await getCurrentUserJwtToken()
            }
        });
    } catch (error) {
        console.log("Error creating checkout session: ", error);
        throw error;
    }

    if (!response.ok) {
        throw new Error(`Failed to create checkout session. Error: ${response.status}`);
    }

    return await response.json() as { sessionId: string };
}
