import AWS from 'aws-sdk';

const client = new AWS.SecretsManager({ region: 'us-east-1' });

export const getSecret = async (secretName: string): Promise<string> => {
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    const secretValue = JSON.parse(data.SecretString as string);
    if (!('value' in secretValue)) {
        throw new Error(`Secret ${secretName} does not have a valid property.`);
    }
    return secretValue.value;
}

export const getOpenAIApiKey = async (): Promise<string> => {
    let openAIApiKey: string | undefined;
    try {
        openAIApiKey = await getSecret("prod/openai");
    } catch (error) {
        console.log("Error getting OpenAI API key: ", error);
        throw error;
    }
    return openAIApiKey;
}

export const getMediumApiKey = async (): Promise<string> => {
    let mediumApiKey: string | undefined;
    try {
        mediumApiKey = await getSecret("turbolearnai/medium-api");
    } catch (error) {
        console.log("Error getting Medium API key: ", error);
        throw error;
    }
    return mediumApiKey;
}

export const getStripeSecretKey = async (): Promise<string> => {
    let stripeSecretKey: string | undefined;

    if (process.env.NODE_ENV === "development" || process.env.IS_OFFLINE) {
        stripeSecretKey = process.env.REACT_APP_STRIPE_SECRET_KEY;
        console.log("🚀 ~ file: secrets.ts:41 ~ getStripeSecretKey ~ process.env.REACT_APP_STRIPE_SECRET_KEY:", process.env.REACT_APP_STRIPE_SECRET_KEY)
        if (!stripeSecretKey) {
            throw new Error("Missing Stripe secret key");
        }
    } else {
        try {
            stripeSecretKey = await getSecret("turbolearnai/stripe-secret");
        } catch (error) {
            console.log("Error getting Stripe secret key: ", error);
            throw error;
        }
    }

    return stripeSecretKey;
}

export const getStripePublishableKey = async (): Promise<string> => {
    let stripePublishableKey: string | undefined;

    if (process.env.NODE_ENV === "development" || process.env.IS_OFFLINE) {
        stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
        if (!stripePublishableKey) {
            throw new Error("Missing Stripe publishable key");
        }
    } else {
        try {
            stripePublishableKey = await getSecret("turbolearnai/stripe-publishable");
        } catch (error) {
            console.log("Error getting Stripe publishable key: ", error);
            throw error;
        }
    }
    
    return stripePublishableKey;
}

export const getDatabaseHost = async (): Promise<string> => {
    let databaseHost: string | undefined;
    if (process.env.NODE_ENV === "development" || process.env.IS_OFFLINE) {
        databaseHost = process.env.REACT_APP_DB_HOST;
        if (!databaseHost) {
            throw new Error("Missing database host");
        }
    } else {
        try {
            databaseHost = await getSecret("turbolearnai/db-host");
        } catch (error) {
            console.log("Error getting database host: ", error);
            throw error;
        }
    }
    return databaseHost;
}

export const getDatabaseName = async (): Promise<string> => {
    let databaseName: string | undefined;
    if (process.env.NODE_ENV === "development" || process.env.IS_OFFLINE) {
        databaseName = process.env.REACT_APP_DB_NAME;
        if (!databaseName) {
            throw new Error("Missing database name");
        }
    } else {
        try {
            databaseName = await getSecret("turbolearnai/db-name");
        } catch (error) {
            console.log("Error getting database name: ", error);
            throw error;
        }
    }
    return databaseName;
}

export const getDatabaseUsername = async (): Promise<string> => {
    let databaseUsername: string | undefined;
    if (process.env.NODE_ENV === "development" || process.env.IS_OFFLINE) {
        databaseUsername = process.env.REACT_APP_DB_USERNAME;
        if (!databaseUsername) {
            throw new Error("Missing database username");
        }
    } else {
        try {
            databaseUsername = await getSecret("turbolearnai/db-username");
        } catch (error) {
            console.log("Error getting database username: ", error);
            throw error;
        }
    }
    return databaseUsername;
}

export const getDatabasePassword = async (): Promise<string> => {
    let databasePassword: string | undefined;
    if (process.env.NODE_ENV === "development" || process.env.IS_OFFLINE) {
        databasePassword = process.env.REACT_APP_DB_PASSWORD;
        if (!databasePassword) {
            throw new Error("Missing database password");
        }
    } else {
        try {
            databasePassword = await getSecret("turbolearnai/db-password");
        } catch (error) {
            console.log("Error getting database password: ", error);
            throw error;
        }
    }
    return databasePassword;
}