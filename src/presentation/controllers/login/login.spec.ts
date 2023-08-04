import {
	MissingParamError,
	InvalidParamError,
	ServerError,
} from "../../../presentation/errors";
import {
	badRequest,
	ok,
	serverError,
} from "../../../presentation/helpers/http-helpers";
import { SignUpController } from "../signup/signup";
import {
	IEmailValidator,
	IAddAccount,
	IAddAccountModel,
	IAccountModel,
	IController,
	IHttpRequest,
} from "../signup/signup-protocols";
import { LoginController } from "./login";

describe("LoginController", () => {
	type SuiType = {
		sut: IController;
	};

	function makeSut(): SuiType {
		return {
			sut: new LoginController(),
		};
	}

	it("should return 400 if email was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: "123",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError("email"))
		);
	});
	it("should return 400 if password was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "johndoe@gmail.com",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError("password"))
		);
	});
});
