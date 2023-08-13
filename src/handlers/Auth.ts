// AWS
import { PreSignUpTriggerEvent } from 'aws-lambda';

export const preSignUpHandler = async (event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> => {
    console.log('preSignUpHandler event:', event);
    event.response.autoConfirmUser = true;
    return event;
}