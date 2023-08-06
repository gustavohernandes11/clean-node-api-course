import { InvalidParamError } from "../../errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

describe("Compare Fields Validation", () => {
	it("should return an InvalidParamError when validation fails", () => {
		const sut = new CompareFieldsValidation(
			"password",
			"confirmedPassword"
		);
		const error = sut.validate({
			password: "any_password",
			confirmedPassword: "wrong_password",
		});
		expect(error).toEqual(new InvalidParamError("confirmedPassword"));
	});
	it("should return nothing when successful validation", () => {
		const sut = new CompareFieldsValidation(
			"password",
			"confirmedPassword"
		);
		const error = sut.validate({
			password: "any_password",
			confirmedPassword: "any_password",
		});
		expect(error).toBeFalsy();
	});
});
