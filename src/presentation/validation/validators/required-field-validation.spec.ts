import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("Compare Fields Validation", () => {
	it("should return an MissingParamError when validation fails", () => {
		const sut = new RequiredFieldValidation("name");
		const error = sut.validate({
			password: "any_password",
		});
		expect(error).toEqual(new MissingParamError("name"));
	});
	it("should return nothing when successful validation", () => {
		const sut = new RequiredFieldValidation("name");
		const error = sut.validate({
			name: "any_name",
		});
		expect(error).toBeFalsy();
	});
});
