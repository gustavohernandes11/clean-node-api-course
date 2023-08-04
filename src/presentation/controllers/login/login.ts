import { IAuthentication } from "../../../domain/usecases/authentication";
import {
	InvalidParamError,
	MissingParamError,
} from "../../../presentation/errors";
import {
	badRequest,
	ok,
	serverError,
} from "../../../presentation/helpers/http-helpers";
import {
	IController,
	IEmailValidator,
	IHttpRequest,
	IHttpResponse,
} from "../signup/signup-protocols";

export class LoginController implements IController {
	constructor(
		private readonly emailValidator: IEmailValidator,
		private readonly authentication: IAuthentication
	) {}

	async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const { email, password } = httpRequest.body;
			const requiredParams = ["email", "password"];

			for (const param of requiredParams) {
				if (!httpRequest.body[param]) {
					return badRequest(new MissingParamError(param));
				}
			}
			const isValid = this.emailValidator.isValid(email);
			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}
			const authentication = this.authentication.auth(email, password);

			return ok("");
		} catch (error) {
			return serverError();
		}
	}
}
