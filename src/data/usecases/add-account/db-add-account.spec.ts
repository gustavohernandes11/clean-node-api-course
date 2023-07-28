import { IEncrypter } from "data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";
import { IAddAccount } from "domain/usecases/add-account";

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
});
