import { IValidation } from "../../../presentation/protocols/validation";
import { IEmailValidator } from "../protocols";
import { EmailValidation } from "./email-validation";
import { InvalidParamError } from "../../../presentation/errors";

describe("Email Validation", () => {
	const makeEmailValidatorStub = (): IEmailValidator => {
		class EmailValidatorStub implements IEmailValidator {
			isValid(email: string): boolean {
				return true;
			}
		}
		return new EmailValidatorStub();
	};
	type SutType = {
		sut: EmailValidation;
		emailValidatorStub: IEmailValidator;
	};
	const makeSut = (): SutType => {
		const emailValidatorStub = makeEmailValidatorStub();
		const sut = new EmailValidation("email", emailValidatorStub);
		return {
			sut,
			emailValidatorStub,
		};
	};
	it("should check the correct email", () => {
		const { sut, emailValidatorStub } = makeSut();
		const validatorSpy = jest.spyOn(emailValidatorStub, "isValid");
		sut.validate({ email: "any_email@gmail.com" });
		expect(validatorSpy).toHaveBeenCalledWith("any_email@gmail.com");
	});
	it("should throw a error if email validator return false", () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
		const error = sut.validate({ email: "any_email@gmail.com" });
		expect(error).toEqual(new InvalidParamError("email"));
	});
	it("should throw a error if email validator throws", () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});
		expect(sut.validate).toThrow();
	});
});
