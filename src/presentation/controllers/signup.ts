import { IHttpRequest, IHttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helpers";

export class SignUpController {
	handle(httpRequest: IHttpRequest): IHttpResponse {
		const requiredParams = ["name", "email"];
		for (const param of requiredParams) {
			if (!httpRequest.body[param]) {
				return badRequest(new MissingParamError(param));
			}
		}

		return {
			statusCode: 200,
			body: "Ok!",
		};
	}
}
