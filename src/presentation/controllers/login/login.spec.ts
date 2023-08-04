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
	function makeEmailValidator(): IEmailValidator {
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
	};

	function makeSut(): SuiType {
		const emailValidatorStub = makeEmailValidator();
		return {
			sut: new LoginController(emailValidatorStub),
			emailValidatorStub,
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
	it("should return 400 if password is not provided", async () => {
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
	it("should return 400 if invalid email is provided", async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
		const httpRequest = {
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
		const httpRequest = {
			body: {
				email: "jhondoe@gmail.com",
				password: "123",
			},
		};
		await sut.handle(httpRequest);
		expect(isValidSpy).toHaveBeenCalledWith("jhondoe@gmail.com");
	});
});
