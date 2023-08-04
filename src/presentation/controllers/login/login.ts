import { MissingParamError } from "../../../presentation/errors";
import {
	badRequest,
	ok,
	serverError,
} from "../../../presentation/helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
} from "../signup/signup-protocols";

export class LoginController implements IController {
	async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const { email, password } = httpRequest.body;
			const requiredParams = ["email", "password"];

			for (const param of requiredParams) {
				if (!httpRequest.body[param]) {
					return badRequest(new MissingParamError(param));
				}
			}

			return ok("");
		} catch (error) {
			return serverError();
		}
	}
}
