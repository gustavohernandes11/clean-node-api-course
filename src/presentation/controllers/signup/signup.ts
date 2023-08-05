import {
	IHttpRequest,
	IHttpResponse,
	IController,
	IAddAccount,
} from "../signup/signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";
import { IValidation } from "../../../presentation/protocols/validation";

export class SignUpController implements IController {
	constructor(
		private readonly addAccount: IAddAccount,
		private readonly validation: IValidation
	) {}

	async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validation.validate(httpRequest.body);
			if (!!error) return badRequest(error);

			const { name, email, password } = httpRequest.body;

			const account = await this.addAccount.add({
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
