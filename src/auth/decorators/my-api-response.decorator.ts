import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export const MyApiResponse = (succesExample: any) => applyDecorators(
	ApiResponse({ status: 200, description: 'Success', example: succesExample }),
	ApiResponse({ status: 400, description: 'Bad Request', example: { message: 'Bad Request', statusCode: 400 } }),
	ApiResponse({ status: 401, description: 'Unauthorized', example: { message: 'Unauthorized', statusCode: 401 } }),
	ApiResponse({ status: 403, description: 'Forbidden', example: { message: 'Forbidden', statusCode: 403 } }),
	ApiResponse({ status: 404, description: 'Not Found', example: { message: 'Not Found', statusCode: 404 } }),
	ApiResponse({ status: 500, description: 'Internal Server Error', example: { message: 'Internal Server Error', statusCode: 500 } }),
)