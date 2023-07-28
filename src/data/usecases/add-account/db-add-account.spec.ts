import { DbAddAccount } from "./db-add-account";
import {
	IAccountModel,
	IAddAccount,
	IAddAccountModel,
	IAddAccountRepository,
	IEncrypter,
} from "./db-add-account-protocols";

class EncrypterStub implements IEncrypter {
	async encrypt(_: string): Promise<string> {
		return "encrypted_password";
	}
}
class AddAccountRepositoryStub implements IAddAccountRepository {
	add(account: IAddAccountModel): Promise<IAccountModel> {
		const fakeAccount = {
			...account,
			id: 1,
			password: "encrypted_password",
		};
		return new Promise((resolve) => resolve(fakeAccount));
	}
}

type SutType = {
	encrypter: IEncrypter;
	sut: IAddAccount;
	addAccountRepository: IAddAccountRepository;
};

function makeSut(): SutType {
	const encrypter = new EncrypterStub();
	const addAccountRepository = new AddAccountRepositoryStub();
	return {
		sut: new DbAddAccount(encrypter, addAccountRepository),
		encrypter,
		addAccountRepository,
	};
}

describe("DbAddAccount", () => {
	it("should call Encrypter with the correct password", async () => {
		const { sut, encrypter } = makeSut();
		const encrypterSpy = jest.spyOn(encrypter, "encrypt");
		const account = {
			name: "any_name",
			email: "any_email",
			password: "any_password",
		};
		await sut.add(account);
		expect(encrypterSpy).toHaveBeenCalledWith("any_password");
	});
	it("should throw if encrypter throws", async () => {
		const { sut, encrypter } = makeSut();
		jest.spyOn(encrypter, "encrypt").mockReturnValueOnce(
			new Promise((_, reject) => reject(new Error()))
		);

		const account = {
			name: "any_name",
			email: "any_email",
			password: "any_password",
		};

		const promise = sut.add(account);
		await expect(promise).rejects.toThrow();
	});
	it("should call the addAccountRepository with the encrypted password", async () => {
		const { sut, addAccountRepository } = makeSut();
		const addSpy = jest.spyOn(addAccountRepository, "add");

		const fakeAccount = {
			id: 1,
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};

		await sut.add(fakeAccount);
		expect(addSpy).toHaveBeenCalledWith({
			id: 1,
			name: "valid_name",
			email: "valid_email",
			password: "encrypted_password",
		});
	});
	it("should return a account", async () => {
		const { sut } = makeSut();

		const fakeAccount = {
			id: 1,
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};

		const account = await sut.add(fakeAccount);
		expect(account).toEqual({
			id: 1,
			name: "valid_name",
			email: "valid_email",
			password: "encrypted_password",
		});
	});
	it("should throw if addAccountRepository throws", async () => {
		const { sut, addAccountRepository } = makeSut();
		jest.spyOn(addAccountRepository, "add").mockReturnValueOnce(
			new Promise((_, reject) => reject(new Error()))
		);

		const account = {
			name: "any_name",
			email: "any_email",
			password: "any_password",
		};

		const promise = sut.add(account);
		await expect(promise).rejects.toThrow();
	});
});
