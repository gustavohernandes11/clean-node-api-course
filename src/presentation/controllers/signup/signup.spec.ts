import {
	IAccountModel,
	IAddAccount,
	IAddAccountModel,
	IController,
	IHttpRequest,
} from "./signup-protocols";
import {
	MissingParamError,
	InvalidParamError,
	ServerError,
} from "../../errors";
import { SignUpController } from "./signup";
import { ok } from "../../../presentation/helpers/http-helpers";
import { IValidation } from "../../../presentation/protocols/validation";
import { makeSignUpValidation } from "../../../main/factories/signup-validation-factory";

describe("SignUpController", () => {
	function makeAddAccount() {
		class addAccountStub implements IAddAccount {
			async add(_: IAddAccountModel): Promise<IAccountModel> {
				return new Promise((resolve) => resolve(makeFakeAccount()));
			}
		}
		return new addAccountStub();
	}

	type SuiType = {
		sut: IController;
		signUpValidationStub: IValidation;
		addAccountStub: IAddAccount;
	};

	function makeSut(): SuiType {
		const signUpValidationStub = makeSignUpValidation();
		const addAccountStub = makeAddAccount();
		return {
			sut: new SignUpController(addAccountStub, signUpValidationStub),
			signUpValidationStub,
			addAccountStub,
		};
	}
	const makeFakeRequest = (): IHttpRequest => ({
		body: {
			name: "Jhon Doe",
			email: "jhondoe@gmail.com",
			password: "123",
			confirmedPassword: "123",
		},
	});
	const makeFakeAccount = (): IAccountModel => ({
		id: 1,
		name: "Jhon Doe",
		email: "jhondoe@gmail.com",
		password: "123",
	});

	it("should return 400 if name was not provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "jhondoe@gmail.com",
				password: "123",
				confirmedPassword: "123",
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
				password: "123",
				confirmedPassword: "123",
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
				confirmedPassword: "123",
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
				password: "123",
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
				password: "123",
				confirmedPassword: "INVALID_PASSWORD_CONFIRMATION",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new InvalidParamError("confirmedPassword")
		);
	});
	it("should return 500 if emailValidator throws", async () => {
		const { sut, signUpValidationStub } = makeSut();

		jest.spyOn(signUpValidationStub, "validate").mockImplementationOnce(
			() => {
				throw new Error();
			}
		);

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
	it("should call AddAccount with correct parameters", async () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, "add");

		sut.handle(makeFakeRequest());
		expect(addSpy).toHaveBeenCalledWith({
			name: "Jhon Doe",
			email: "jhondoe@gmail.com",
			password: "123",
		});
	});
	it("should return 500 if AddAccount throws", async () => {
		const { sut, addAccountStub } = makeSut();
		jest.spyOn(addAccountStub, "add").mockImplementationOnce(
			async () => new Promise((_, reject) => reject(new Error()))
		);

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
	it("should return 200 if valid data was provided", async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body).toEqual(makeFakeAccount());
	});
});
