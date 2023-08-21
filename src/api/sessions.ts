// System
import { Auth } from 'aws-amplify';
import moment from 'moment';

// Entities
import { LearningSession } from 'src/entity/LearningSession';

// Util
import { getCurrentUserId, getCurrentUserJwtToken } from 'src/utils/auth';

export const createLearningSession = async (): Promise<LearningSession> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sessions`, {
        method: 'POST',
        body: JSON.stringify({
            userId: await getCurrentUserId(),
            year: moment().year(),
            month: moment().month(),
            day: moment().date(),
            title: `Session for ${moment().format('MMM Do, YYYY')}`
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCurrentUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to generate an avatar for the current user. Error: ${response.status}`);
    }

    return await response.json() as LearningSession;
}

export const fetchLearningSessions = async (): Promise<LearningSession[]> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
    };

    const apiPath = `${process.env.REACT_APP_API_BASE_URL}/sessions`;
    const response = await fetch(apiPath, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Failed to get avatars for the current user. Error: ${response.status}`);
    }

    return await response.json() as LearningSession[];
}

export const fetchLearningSession = async (sessionId: number): Promise<LearningSession> => {
    if (process.env.REACT_APP_API_BASE_URL === undefined || process.env.REACT_APP_API_BASE_URL === null) {
        throw new Error('API base URL is not defined.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
    };

    const apiPath = `${process.env.REACT_APP_API_BASE_URL}/sessions/${sessionId}`;
    const response = await fetch(apiPath, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Failed to get the session with ID ${sessionId}. Error: ${response.status}`);
    }

    return await response.json() as LearningSession;
};