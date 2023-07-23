import { ServerError } from "../errors/server-error";
import { IHttpResponse } from "../protocols/http";

export const badRequest = (httpError: Error): IHttpResponse => ({
	statusCode: 400,
	body: httpError,
});
export const serverError = (): IHttpResponse => ({
	statusCode: 500,
	body: new ServerError(),
});
