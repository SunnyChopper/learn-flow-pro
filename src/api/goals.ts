// Entities
import { Goal } from 'src/entity/Goal';

// Util
import { getCurrentUserId, getCurrentUserJwtToken } from 'src/utils/auth';

export const createGoalForUser = async (goal: Goal) => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    goal.userId = await getCurrentUserId();

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/goals`, {
        method: 'POST',
        body: JSON.stringify(goal),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to create goal. Error: ${response.status}`);
    }

    return await response.json() as Goal;
}

export const fetchGoalsForUser = async (): Promise<Goal[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/goals`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get goals for the current user. Error: ${response.status}`);
    }

    return await response.json() as Goal[];
}
