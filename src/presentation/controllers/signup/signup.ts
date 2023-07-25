import {
	IHttpRequest,
	IHttpResponse,
	IController,
	IEmailValidator,
	IAddAccount,
} from "../signup/signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";

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

			const account = this.addAccount.add({
				name,
				email,
				password,
			});
			return ok(account);
		} catch {
			return serverError();
		}
	}
}
