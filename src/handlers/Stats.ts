// System Libraries
import moment from "moment";

// AWS
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Services
import StatsService from '/opt/services/StatsService';

// Utils
import { buildResponse, getUserId } from 'src/utils/lambdas';

export const getNumberOfArticlesSortedForDateHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // 1. Get the date from the query string parameters. If not found, default to today.
    let date: string | undefined = event.queryStringParameters?.date;
    if (!date) {
        date = moment().format('YYYY-MM-DD');
    }

    const stats = new StatsService();
    let numberOfArticlesSortedForDate = await stats.getNumberOfArticlesSortedForDate(date);
    return buildResponse(event, 200, numberOfArticlesSortedForDate);
}