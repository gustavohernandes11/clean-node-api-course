import { BcryptAdaper } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
	async hash(_: string): Promise<string> {
		return new Promise((resolve) => resolve("HASHED_VALUE"));
	},
}));
describe("Bcrypt Adapter", () => {
	describe("encrypt", () => {
		it("should call encrypt with the correct value", () => {
			const salt = 10;
			const sut = new BcryptAdaper(salt);
			const hashSpy = jest.spyOn(sut, "encrypt");
			const target = "some_value";

			sut.encrypt(target);

			expect(hashSpy).toHaveBeenCalledWith(target);
		});
		it("should return a encrypted value", async () => {
			const salt = 10;
			const sut = new BcryptAdaper(salt);

			const original = "some_value";
			const retuned = await sut.encrypt(original);

			expect(retuned).toBe("HASHED_VALUE");
			expect(retuned).not.toBe(original);
		});
	});
});
