import { Auth, Amplify } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';


/* Setup */

export const initializeAuth = async (): Promise<void> => {
    Amplify.configure({
        Auth: {
            identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
            region: process.env.REACT_APP_USER_POOL_REGION || '',
            userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
            userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || '',
        }
    });
}

/* User Authentication */

export const login = async (username: string, password: string): Promise<CognitoUser> => {
    try {
        return await Auth.signIn(username, password);
    } catch (error) {
        console.log('Error signing in: ', error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('Error signing out: ', error);
        throw error;
    }
};

export const register = async (email: string, password: string): Promise<CognitoUser> => {
    try {
        const user = await Auth.signUp({
            username: email,
            password,
        });
        return user.user;
    } catch (error) {
        console.log('error signing up', error);
        throw error;
    }
};

export const confirmRegistration = async (email: string, code: string): Promise<void> => {
    try {
        await Auth.confirmSignUp(email, code);
    } catch (error) {
        console.log('error confirming sign up', error);
        throw error;
    }
};

export const resendConfirmationCode = async (email: string): Promise<void> => {
    try {
        await Auth.resendSignUp(email);
    } catch (error) {
        console.log('error resending confirmation code', error);
        throw error;
    }
};

export const forgotPassword = async (email: string): Promise<void> => {
    try {
        await Auth.forgotPassword(email);
    } catch (error) {
        console.log('error forgot password', error);
        throw error;
    }
};

export const forgotPasswordSubmit = async (email: string, code: string, password: string): Promise<void> => {
    try {
        await Auth.forgotPasswordSubmit(email, code, password);
    } catch (error) {
        console.log('error forgot password submit', error);
        throw error;
    }
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.changePassword(user, oldPassword, newPassword);
    } catch (error) {
        console.log('error changing password', error);
        throw error;
    }
}

export const isLoggedIn = async (): Promise<boolean> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        return user ? true : false;
    } catch (error) {
        console.log('error checking if user is logged in', error);
        return false;
    }
}

export const getCurrentUserJwtToken = async (): Promise<string> => {
    try {
        const currentSession = await Auth.currentSession();
        const jwtToken: string = currentSession.getIdToken().getJwtToken();
        return jwtToken;
    } catch (error) {
        console.log('error getting current user jwt token', error);
        throw error;
    }
};

export const getCurrentUserId = async (): Promise<string> => {
    if (!Auth || !Auth.currentSession) {
        await initializeAuth();
    }

    try {
        const currentSession = await Auth.currentSession();
        const userId: string = currentSession.getIdToken().payload.sub;
        return userId;
    } catch (error) {
        console.log('error getting current user id', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<CognitoUser> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        return user;
    } catch (error) {
        console.log('error getting current user', error);
        throw error;
    }
};

export const getUserAttributes = async (): Promise<any> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        const attributes = await Auth.userAttributes(user);
        return attributes;
    } catch (error) {
        console.log('error getting user attributes', error);
        throw error;
    }
};

export const updateUserAttributes = async (attributes: any): Promise<void> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, attributes);
    } catch (error) {
        console.log('error updating user attributes', error);
        throw error;
    }
};

export const verifyUserAttribute = async (attributeName: string): Promise<void> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.verifyUserAttribute(user, attributeName);
    } catch (error) {
        console.log('error verifying user attribute', error);
        throw error;
    }
};

export const verifyUserAttributeSubmit = async (attributeName: string, code: string): Promise<void> => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.verifyUserAttributeSubmit(user, attributeName, code);
    } catch (error) {
        console.log('error verifying user attribute submit', error);
        throw error;
    }
};




