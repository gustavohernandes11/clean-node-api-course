import { DbAddAccount } from "./db-add-account";
import { IAddAccount, IEncrypter } from "./db-add-account-protocols";

class EncrypterStub implements IEncrypter {
	async encrypt(_: string): Promise<string> {
		return "encrypted_value";
	}
}
type SutType = {
	encrypter: IEncrypter;
	sut: IAddAccount;
};
function makeSut(): SutType {
	const encrypter = new EncrypterStub();
	return {
		sut: new DbAddAccount(encrypter),
		encrypter,
	};
}

describe("DB AddAccount", () => {
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
});
