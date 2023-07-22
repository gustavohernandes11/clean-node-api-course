import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController {
	handle(httpRequest: IHttpRequest): IHttpResponse {
		if (!httpRequest.body.name || httpRequest.body.name.length === 0) {
			return {
				statusCode: 400,
				body: new Error("missing param: name"),
			};
		}
		if (!httpRequest.body.email) {
			return {
				statusCode: 400,
				body: new Error("missing param: email"),
			};
		}
		return {
			statusCode: 400,
			body: "",
		};
	}
}
