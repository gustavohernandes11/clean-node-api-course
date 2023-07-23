import { IHttpRequest, IHttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { InvalidParamError } from "../errors/invalid-param-error";
import { badRequest } from "../helpers/http-helpers";
import { IController } from "../protocols/controller";
import { IEmailValidator } from "../protocols/email-validator";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator) {
		this.emailValidator = emailValidator;
	}

	handle(httpRequest: IHttpRequest): IHttpResponse {
		const requiredParams = [
			"name",
			"email",
			"password",
			"confirmedPassword",
		];
		for (const param of requiredParams) {
			if (!httpRequest.body[param]) {
				return badRequest(new MissingParamError(param));
			}
		}
		const isValid = this.emailValidator.isValid(httpRequest.body.email);
		if (!isValid) return badRequest(new InvalidParamError("email"));

		return {
			statusCode: 200,
			body: "Ok!",
		};
	}
}
