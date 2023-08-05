import { RequiredFieldValidation } from "../../presentation/validation/validators/required-field-validation";
import { IValidation } from "../../presentation/protocols/validation";
import { ValidatorComposite } from "../../presentation/validation/validators/validator-composite";
import { EmailValidation } from "../../presentation/validation/validators/email-validation";
import { EmailValidatorAdaper } from "../../utils/email-validator-adapter";
import { CompareFieldsValidation } from "../../presentation/validation/validators/compare-fields-validation";

export const makeSignUpValidation = () => {
	const validations: IValidation[] = [];
	const requiredParams = ["name", "email", "password", "confirmedPassword"];
	for (const param of requiredParams) {
		validations.push(new RequiredFieldValidation(param));
	}

	validations.push(new EmailValidation("email", new EmailValidatorAdaper()));
	validations.push(
		new CompareFieldsValidation("password", "confirmedPassword")
	);
	return new ValidatorComposite(validations);
};
