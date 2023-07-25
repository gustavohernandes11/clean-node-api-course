import {
	IAccountModel,
	IAddAccount,
	IAddAccountModel,
	IController,
	IEmailValidator,
} from "./signup-protocols";
import {
	MissingParamError,
	InvalidParamError,
	ServerError,
} from "../../errors";
import { SignUpController } from "./signup";

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
			async add(account: IAddAccountModel): Promise<IAccountModel> {
				const fakeAccount = {
					id: 1,
					name: account.name,
					email: account.email,
					password: account.password,
				};
				return new Promise((resolve) => resolve(fakeAccount));
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

	it("should return 400 if name was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("name"));
	});
	it("should return 400 if email was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("email"));
	});
	it("should return 400 if password was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				confirmedPassword: 123,
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("password"));
	});
	it("should return 400 if confirmedPassword was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new MissingParamError("confirmedPassword")
		);
	});
	it("should return 400 if password confirmation fails", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: "INVALID_PASSWORD_CONFIRMATION",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new InvalidParamError("confirmedPassword")
		);
	});
	it("should return 400 if email was invalid", async () => {
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
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError("email"));
	});
	it("should check the correct email", async () => {
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
	it("should return 500 if emailValidator throws", async () => {
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

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
	it("should call AddAccount with correct parameters", async () => {
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
	it("should return 500 if AddAccount throws", async () => {
		const { sut, addAccountStub } = makeSut();
		jest.spyOn(addAccountStub, "add").mockImplementationOnce(
			async () => new Promise((_, reject) => reject(new Error()))
		);
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
	it("should return 200 if valid data was provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
	});
});
