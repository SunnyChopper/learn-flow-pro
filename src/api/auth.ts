// Util
import { getCurrentUserJwtToken } from 'src/utils/auth';

// Entity
import { Membership } from 'src/entity/Membership';

export const getCurrentUserMembership = async (): Promise<Membership | null> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    let response: Response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/membership`, {
            method: 'GET',
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

    return await response.json() as Membership | null;
}

export const createFreeMembership = async (): Promise<Membership> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    let response: Response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/membership/free`, {
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

    return await response.json() as Membership;
}

export const updateCurrentUserMembership = async (membership: Membership): Promise<Membership> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    let response: Response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/membership`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await getCurrentUserJwtToken()
            },
            body: JSON.stringify(membership)
        });
    } catch (error) {
        console.log("Error creating checkout session: ", error);
        throw error;
    }

    if (!response.ok) {
        throw new Error(`Failed to create checkout session. Error: ${response.status}`);
    }

    return await response.json() as Membership;
}