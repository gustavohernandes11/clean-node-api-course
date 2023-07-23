import { IEmailValidator } from "../protocols/email-validator";
import { MissingParamError } from "../errors/missing-param-error";
import { SignUpController } from "./signup";
import { InvalidParamError } from "../errors/invalid-param-error";
import { IController } from "../protocols/controller";

describe("SignUpController", () => {
	type SuiType = {
		sut: IController;
		emailValidator: IEmailValidator;
	};
	class EmailValidatorStub implements IEmailValidator {
		isValid(): boolean {
			return true;
		}
	}
	const emailValidatorStub = new EmailValidatorStub();

	function makeSut(): SuiType {
		return {
			sut: new SignUpController(emailValidatorStub),
			emailValidator: emailValidatorStub,
		};
	}

	it("should return 400 if name was not provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("name"));
	});
	it("should return 400 if email was not provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("email"));
	});
	it("should return 400 if password was not provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				confirmedPassword: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("password"));
	});
	it("should return 400 if confirmedPassword was not provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new MissingParamError("confirmedPassword")
		);
	});
	it("should return 400 if email was invalid", () => {
		const { sut, emailValidator } = makeSut();
		jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError("email"));
	});
});
