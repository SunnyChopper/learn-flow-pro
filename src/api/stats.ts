// System
import { Auth } from 'aws-amplify';
import moment from 'moment';

// Entities
import { LearningSession } from 'src/entity/LearningSession';

// Util
import { getCurrentUserId, getCurrentUserJwtToken } from 'src/utils/auth';

export const getNumberOfArticlesSortedForDate = async (date: string): Promise<number> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    let response: Response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/stats/articles/sorted?date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log("Error fetching number of articles sorted for date: ", error);
        throw error;
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch number of articles sorted for date. Error: ${response.status}`);
    }

    return await response.json() as number;
}