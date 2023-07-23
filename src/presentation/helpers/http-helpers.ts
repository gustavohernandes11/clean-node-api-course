import { IHttpResponse } from "../protocols/http";

export const badRequest = (httpError: Error): IHttpResponse => ({
	statusCode: 400,
	body: httpError,
});
