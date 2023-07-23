import { IController, IEmailValidator } from "../protocols";
import { MissingParamError, InvalidParamError, ServerError } from "../errors";
import { SignUpController } from "./signup";

describe("SignUpController", () => {
	type SuiType = {
		sut: IController;
		emailValidator: IEmailValidator;
	};

	function makeEmailValidatorStub(): IEmailValidator {
		class EmailValidatorStub implements IEmailValidator {
			isValid(): boolean {
				return true;
			}
		}

		return new EmailValidatorStub();
	}

	function makeSut(): SuiType {
		const emailValidatorStub = makeEmailValidatorStub();
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
	it("should return 400 if password confirmation fails", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: "INVALID_PASSWORD_CONFIRMATION",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new InvalidParamError("confirmedPassword")
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
	it("should check the correct email", () => {
		const { sut, emailValidator } = makeSut();
		const emailValidatorSpy = jest.spyOn(emailValidator, "isValid");

		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		sut.handle(httpRequest);
		expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email);
	});
	it("should return 500 if emailValidator throws", () => {
		const { sut, emailValidator } = makeSut();

		jest.spyOn(emailValidator, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});

		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
});
