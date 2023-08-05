import { IValidation } from "../../../presentation/protocols/validation";
import { InvalidParamError } from "../../../presentation/errors";

export class CompareFieldsValidation implements IValidation {
	constructor(
		private readonly fieldName: string,
		private readonly fieldToCompareName: string
	) {}
	validate(input: any): any {
		if (input[this.fieldName] !== input[this.fieldToCompareName]) {
			return new InvalidParamError(this.fieldToCompareName);
		}
	}
}
