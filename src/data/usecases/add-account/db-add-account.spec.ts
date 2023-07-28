import { IEncrypter } from "data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

class EncrypterStub implements IEncrypter {
	async encrypt(_: string): Promise<string> {
		return "encrypted_value";
	}
}
function makeDbAddAccount(): DbAddAccount {
	return new DbAddAccount(new EncrypterStub());
}

describe("DB AddAccount", () => {
	it("should call Encrypter with the correct password", async () => {
		const sut = makeDbAddAccount();
		const encrypterSpy = jest.spyOn(sut.encrypter, "encrypt");
		const account = {
			name: "any_name",
			email: "any_email",
			password: "any_password",
		};
		await sut.add(account);
		expect(encrypterSpy).toHaveBeenCalledWith("any_password");
	});
});
