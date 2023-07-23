import { ServerError } from "../errors";
import { IHttpResponse } from "../protocols";

export const badRequest = (httpError: Error): IHttpResponse => ({
	statusCode: 400,
	body: httpError,
});
export const serverError = (): IHttpResponse => ({
	statusCode: 500,
	body: new ServerError(),
});
