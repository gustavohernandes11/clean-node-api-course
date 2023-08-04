import {
	MissingParamError,
	InvalidParamError,
} from "../../../presentation/errors";
import {
	badRequest,
	serverError,
} from "../../../presentation/helpers/http-helpers";
import {
	IEmailValidator,
	IController,
	IAuthentication,
	IHttpRequest,
} from "./login-protocols";
import { LoginController } from "./login";

describe("LoginController", () => {
	const makeFakeRequest = (): IHttpRequest => ({
		body: {
			email: "jhondoe@gmail.com",
			password: "123",
		},
	});

	function makeAuthenticationStub(): IAuthentication {
		class AuthenticationStub implements IAuthentication {
			auth(_: string, __: string): boolean {
				return true;
			}
		}

		return new AuthenticationStub();
	}
	function makeEmailValidatorStub(): IEmailValidator {
		class EmailValidatorStub implements IEmailValidator {
			isValid(): boolean {
				return true;
			}
		}

		return new EmailValidatorStub();
	}

	type SuiType = {
		sut: IController;
		emailValidatorStub: IEmailValidator;
		authenticationStub: IAuthentication;
	};

	function makeSut(): SuiType {
		const emailValidatorStub = makeEmailValidatorStub();
		const authenticationStub = makeAuthenticationStub();
		return {
			sut: new LoginController(emailValidatorStub, authenticationStub),
			emailValidatorStub,
			authenticationStub,
		};
	}

	it("should return 400 if email was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest: IHttpRequest = {
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
	it("should return 400 if password is not provided", async () => {
		const { sut } = makeSut();
		const httpRequest: IHttpRequest = {
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
	it("should return 400 if invalid email is provided", async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
		const httpRequest: IHttpRequest = {
			body: {
				email: "invalid_email",
				password: "123",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse).toEqual(
			badRequest(new InvalidParamError("email"))
		);
	});
	it("should verify the correct email with emailValidator", async () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
		const httpRequest: IHttpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(isValidSpy).toHaveBeenCalledWith("jhondoe@gmail.com");
	});
	it("should return 500 if email validator throws", async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});
		const httpRequest: IHttpRequest = makeFakeRequest();
		const response = await sut.handle(httpRequest);
		expect(response).toEqual(serverError());
	});
	it("should call authentication with correct values", async () => {
		const { sut, authenticationStub } = makeSut();
		const authSpy = jest.spyOn(authenticationStub, "auth");
		const httpRequest: IHttpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(authSpy).toHaveBeenCalledWith("jhondoe@gmail.com", "123");
	});
});
