// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PreSignUpTriggerEvent } from 'aws-lambda';

// Database
import { Membership } from "src/entity/Membership";

// Services
import MembershipService from '/opt/services/MembershipService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const preSignUpHandler = async (event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> => {
    event.response.autoConfirmUser = true;
    return event;
}

export const getUserMembershipHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId: string | undefined = await getUserId(event);
        if (!userId) { return buildResponse(event, 400, { message: 'Invalid user id.' }); }
        const membership: Membership | null = await new MembershipService(userId).getMembership();
        return buildResponse(event, 200, membership);
    } catch (error) {
        console.log('Error getting user membership', error);
        return buildResponse(event, 500, error);
    }
}

export const createFreeMembershipHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId: string | undefined = await getUserId(event);
        if (!userId) { return buildResponse(event, 400, { message: 'Invalid user id.' }); }
        const membership = await new MembershipService(userId).createFreeMembership();
        return buildResponse(event, 200, membership);
    } catch (error) {
        console.log('Error creating free membership', error);
        return buildResponse(event, 500, { error: error });
    }
}

export const updateMembershipHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId: string | undefined = await getUserId(event);
        if (!userId) { return buildResponse(event, 400, { message: 'Invalid user id.' }); }
        const membership: Membership = JSON.parse(event.body || '{}');
        if (Object.keys(membership).length === 0) {
            return buildResponse(event, 400, { message: 'Invalid membership.' });
        }
        const updatedMembership = await new MembershipService(userId).updateMembership(membership);
        return buildResponse(event, 200, updatedMembership);
    } catch (error) {
        console.log('Error updating membership', error);
        return buildResponse(event, 500, { error: error });
    }
}