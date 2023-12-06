import Stripe from 'stripe';
import { getStripeSecretKey } from 'src/utils/secrets';

export const initializeStripe = async (): Promise<Stripe> => {
    try {
        const stripeSecretKey = await getStripeSecretKey();
        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
        return stripe;
    } catch (error) {
        console.log('Error initializing Stripe', error);
        throw error;
    }
}