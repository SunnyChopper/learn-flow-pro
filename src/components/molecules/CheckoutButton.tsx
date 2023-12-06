import React from 'react';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getStripePublishableKey } from 'src/utils/secrets';
import { getCurrentUserId } from 'src/utils/auth';
import { createCheckoutSession } from 'src/api/checkout';
import Button from '@mui/material/Button';

const CheckoutButton = () => {
    const [stripe, setStripe] = React.useState<Stripe | null>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [buttonText, setButtonText] = React.useState('Loading...');
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        const initStripe = async () => {
            try {
                const userId = await getCurrentUserId();
                const stripePublishableKey = await getStripePublishableKey();
                const stripeInstance = await loadStripe(stripePublishableKey);
                setStripe(stripeInstance);
                setButtonText('Checkout');
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setButtonText('Error');
                setIsLoading(false);
            }
        }

        initStripe();
    }, []);

    const handleClick = async () => {
        if (!stripe) return;

        setIsLoading(true);
        const createSessionResponse = await createCheckoutSession('price_1O5MZFJ8waV4l4Wbk3cSsL65');
        const sessionId = createSessionResponse.sessionId;
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
            console.error(result.error);
        }
        setIsLoading(false);
    }

    return (
        <Button variant="contained" color="primary" onClick={handleClick} disabled={isLoading}>
            {buttonText}
        </Button>
    )
}

export default CheckoutButton;