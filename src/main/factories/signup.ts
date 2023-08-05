import { EmailValidatorAdaper } from "../../utils/email-validator-adapter";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdaper } from "../../infra/criptografy/bcrypt-adapter";
import { LogControllerDecorator } from "../decorators/log";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";

export const makeSignUpController = () => {
	const salt = 12;
	const emailValidatorAdaper = new EmailValidatorAdaper();
	const bcryptAdapter = new BcryptAdaper(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);
	const signUpController = new SignUpController(
		emailValidatorAdaper,
		dbAddAccount
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(signUpController, logMongoRepository);
};
