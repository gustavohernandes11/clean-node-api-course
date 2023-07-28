import { EmailValidatorAdaper } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
	isEmail(): boolean {
		return true;
	},
}));

describe("EmailValidator Adapter", () => {
	it("should return false if validator returns false", () => {
		const sut = new EmailValidatorAdaper();
		jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
		const isValid = sut.isValid("invalid_email@gmail.com");
		expect(isValid).toBe(false);
	});
	it("should return true if validator returns true", () => {
		const sut = new EmailValidatorAdaper();
		const isValid = sut.isValid("valid_email@gmail.com");
		expect(isValid).toBe(true);
	});
	it("should call isEmail with correct email", () => {
		const sut = new EmailValidatorAdaper();
		const validatorSpy = jest.spyOn(validator, "isEmail");
		sut.isValid("any@gmail.com");
		expect(validatorSpy).toHaveBeenCalledWith("any@gmail.com");
	});
});
