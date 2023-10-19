import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

const ALLOWED_ORIGINS = process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || [];

export const buildResponse = (event: APIGatewayProxyEvent, statusCode: number, body: any): APIGatewayProxyResult => {
    let allowOriginUrl: string | undefined;
    if (event.headers.origin !== undefined && ALLOWED_ORIGINS.includes(event.headers.origin)) {
        allowOriginUrl = event.headers.origin;
    } else if (event.headers.host !== undefined && ALLOWED_ORIGINS.includes(event.headers.host)) {
        allowOriginUrl = event.headers.host;
    }

    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': allowOriginUrl || '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(body)
    }
};

export const getUserId = (event: APIGatewayProxyEvent): string | undefined => {
    return event.requestContext.authorizer?.claims?.sub as string | undefined;
}