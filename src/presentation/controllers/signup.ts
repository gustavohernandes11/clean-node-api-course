import {
	IHttpRequest,
	IHttpResponse,
	IController,
	IEmailValidator,
} from "../protocols";
import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helpers";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator) {
		this.emailValidator = emailValidator;
	}

	handle(httpRequest: IHttpRequest): IHttpResponse {
		try {
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

			if (
				httpRequest.body.password !== httpRequest.body.confirmedPassword
			)
				return badRequest(new InvalidParamError("confirmedPassword"));

			return {
				statusCode: 200,
				body: "Ok!",
			};
		} catch {
			return serverError();
		}
	}
}
