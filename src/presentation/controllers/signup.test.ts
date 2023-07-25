import { IController, IEmailValidator } from "../protocols";
import { MissingParamError, InvalidParamError, ServerError } from "../errors";
import { SignUpController } from "./signup";
import { IAddAccount, IAddAccountModel } from "domain/usecases/add-account";
import { IAccountModel } from "domain/models/account";

describe("SignUpController", () => {
	function makeEmailValidator(): IEmailValidator {
		class EmailValidatorStub implements IEmailValidator {
			isValid(): boolean {
				return true;
			}
		}

		return new EmailValidatorStub();
	}
	function makeAddAccount() {
		class addAccountStub implements IAddAccount {
			add(account: IAddAccountModel): IAccountModel {
				const fakeAccount = {
					id: 1,
					name: account.name,
					email: account.email,
					password: account.password,
				};
				return fakeAccount;
			}
		}
		return new addAccountStub();
	}

	type SuiType = {
		sut: IController;
		emailValidator: IEmailValidator;
		addAccountStub: IAddAccount;
	};

	function makeSut(): SuiType {
		const emailValidatorStub = makeEmailValidator();
		const addAccountStub = makeAddAccount();
		return {
			sut: new SignUpController(emailValidatorStub, addAccountStub),
			emailValidator: emailValidatorStub,
			addAccountStub,
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
	it("should call AddAccount with correct parameters", () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, "add");
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};

		sut.handle(httpRequest);
		expect(addSpy).toHaveBeenCalledWith({
			name: "Jhon Doe",
			email: "jhondoe@gmail.com",
			password: 123,
		});
	});
});
