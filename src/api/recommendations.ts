// Entities
import { Recommendation } from 'src/entity/Recommendation';

// Util
import { getCurrentUserJwtToken } from 'src/utils/auth';

export const generateTopicRecommendations = async (): Promise<{ topics: string[] }> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recommendations/topics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to generate topic recommendations. Error: ${response.status}`);
    }

    return await response.json() as { topics: string[] };
}

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recommendations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get recommendations. Error: ${response.status}`);
    }

    return await response.json() as Recommendation[];
}