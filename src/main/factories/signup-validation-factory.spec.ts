import { RequiredFieldValidation } from "../../presentation/validation/validators/required-field-validation";
import { IValidation } from "../../presentation/protocols/validation";
import { CompareFieldsValidation } from "../../presentation/validation/validators/compare-fields-validation";
import { EmailValidation } from "../../presentation/validation/validators/email-validation";
import { ValidatorComposite } from "../../presentation/validation/validators/validator-composite";
import { EmailValidatorAdaper } from "../../utils/email-validator-adapter";
import { makeSignUpValidation } from "./signup-validation-factory";

jest.mock("../../presentation/validation/validators/validator-composite");

describe("Signup Validation Factory", () => {
	it("should call all the validations", () => {
		makeSignUpValidation();
		const validations: IValidation[] = [];
		const requiredParams = [
			"name",
			"email",
			"password",
			"confirmedPassword",
		];
		for (const param of requiredParams) {
			validations.push(new RequiredFieldValidation(param));
		}

		validations.push(
			new EmailValidation("email", new EmailValidatorAdaper())
		);
		validations.push(
			new CompareFieldsValidation("password", "confirmedPassword")
		);
		expect(ValidatorComposite).toHaveBeenCalledWith(validations);
	});
});
