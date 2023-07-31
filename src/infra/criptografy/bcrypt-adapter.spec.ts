import { BcryptAdaper } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
	async hash(_: string): Promise<string> {
		return new Promise((resolve) => resolve("HASHED_VALUE"));
	},
}));
describe("Bcrypt Adapter", () => {
	it("should call encrypt with the correct value", () => {
		const salt = 10;
		const sut = new BcryptAdaper(salt);
		const hashSpy = jest.spyOn(sut, "encrypt");
		const target = "some_value";

		sut.encrypt(target);

		expect(hashSpy).toHaveBeenCalledWith(target);
	});
});
