import {
	IHttpRequest,
	IHttpResponse,
	IController,
	IEmailValidator,
} from "../protocols";
import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helpers";
import { IAddAccount } from "domain/usecases/add-account";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;
	private readonly addAccount: IAddAccount;

	constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
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
			const { name, email, password, confirmedPassword } =
				httpRequest.body;

			const isValid = this.emailValidator.isValid(email);
			if (!isValid) return badRequest(new InvalidParamError("email"));

			if (password !== confirmedPassword)
				return badRequest(new InvalidParamError("confirmedPassword"));

			this.addAccount.add({
				name,
				email,
				password,
			});
			return {
				statusCode: 200,
				body: "Ok!",
			};
		} catch {
			return serverError();
		}
	}
}
