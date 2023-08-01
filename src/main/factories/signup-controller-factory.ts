import { EmailValidatorAdaper } from "../../utils/email-validator-adapter";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdaper } from "../../infra/criptografy/bcrypt-adapter";

export const makeSignUpController = () => {
	const salt = 12;
	const emailValidatorAdaper = new EmailValidatorAdaper();
	const bcryptAdapter = new BcryptAdaper(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);
	return new SignUpController(emailValidatorAdaper, dbAddAccount);
};
