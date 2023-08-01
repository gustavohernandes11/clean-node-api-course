import { EmailValidatorAdaper } from "../../utils/email-validator-adapter";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdaper } from "infra/criptografy/bcrypt-adapter";

export function makeSignUpController() {
	const emailValidator = new EmailValidatorAdaper();
	const accountMongoRepository = new AccountMongoRepository();
	const salt = 12;
	const bcryptAdapter = new BcryptAdaper(salt);
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);
	const signUpController = new SignUpController(emailValidator, dbAddAccount);
	return signUpController;
}
