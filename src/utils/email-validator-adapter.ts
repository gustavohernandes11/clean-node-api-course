import { IEmailValidator } from "presentation/validation/protocols/email-validator";
import validator from "validator";

export class EmailValidatorAdaper implements IEmailValidator {
	isValid(email: string): boolean {
		return validator.isEmail(email);
	}
}
