import { ServerError, UnauthorizedError } from "../errors";
import { IHttpResponse } from "../protocols";

export const badRequest = (httpError: Error): IHttpResponse => ({
	statusCode: 400,
	body: httpError,
});
export const unauthorized = (): IHttpResponse => ({
	statusCode: 401,
	body: new UnauthorizedError(),
});
export const serverError = (error?: Error): IHttpResponse => ({
	statusCode: 500,
	body: new ServerError(error?.stack),
});
export const ok = (body: any): IHttpResponse => ({
	statusCode: 200,
	body,
});
