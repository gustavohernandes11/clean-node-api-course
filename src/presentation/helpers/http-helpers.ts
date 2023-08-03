import { ServerError } from "../errors";
import { IHttpResponse } from "../protocols";

export const badRequest = (httpError: Error): IHttpResponse => ({
	statusCode: 400,
	body: httpError,
});
export const serverError = (error?: Error): IHttpResponse => ({
	statusCode: 500,
	body: new ServerError(error?.stack),
});
export const ok = (body: any): IHttpResponse => ({
	statusCode: 200,
	body,
});
