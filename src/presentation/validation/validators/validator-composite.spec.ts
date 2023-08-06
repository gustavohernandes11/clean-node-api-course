import { InvalidParamError } from "../../../presentation/errors";
import { IValidation } from "../../protocols/validation";
import { ValidatorComposite } from "./validator-composite";

class ValidationSpy implements IValidation {
	validate(_: any) {
		return null;
	}
}
type SutType = {
	sut: IValidation;
	validations: IValidation[];
};
const makeSut = (): SutType => {
	const validations: IValidation[] = [
		new ValidationSpy(),
		new ValidationSpy(),
	];

	return {
		sut: new ValidatorComposite(validations),
		validations,
	};
};
describe("Validator Composite", () => {
	it("should return an error if any validation fails", async () => {
		const { sut, validations } = makeSut();
		jest.spyOn(validations[0], "validate").mockReturnValueOnce(
			new InvalidParamError("exemple_param")
		);
		const error = await sut.validate({ randomParam: "" });
		expect(error).toEqual(new InvalidParamError("exemple_param"));
	});
	it("should return the first error if more than one validation fails", async () => {
		const { sut, validations } = makeSut();
		jest.spyOn(validations[0], "validate").mockReturnValueOnce(
			new InvalidParamError("exemple_param")
		);
		jest.spyOn(validations[1], "validate").mockReturnValueOnce(
			new Error("second_error")
		);
		const error = await sut.validate({ randomParam: "" });
		expect(error).toEqual(new InvalidParamError("exemple_param"));
	});
});
