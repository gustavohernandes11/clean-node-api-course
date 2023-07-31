import { BcryptAdaper } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
	async hash(_: string): Promise<string> {
		return new Promise((resolve) => resolve("encrypted"));
	},
}));
describe("Bcrypt Adapter", () => {
	function makeSut() {
		const salt = 10;
		const sut = new BcryptAdaper(salt);
		return { sut };
	}
	describe("encrypt", () => {
		it("should call encrypt with the correct value", () => {
			const { sut } = makeSut();
			const hashSpy = jest.spyOn(sut, "encrypt");
			const target = "some_value";

			sut.encrypt(target);

			expect(hashSpy).toHaveBeenCalledWith(target);
		});
		it("should return a encrypted value", async () => {
			const { sut } = makeSut();

			const original = "some_value";
			const retuned = await sut.encrypt(original);

			expect(retuned).toBe("encrypted");
			expect(retuned).not.toBe(original);
		});
	});
});
