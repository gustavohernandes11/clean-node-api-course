import { SignUpController } from "../../presentation/controllers/signup/signup";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdaper } from "../../infra/criptografy/bcrypt-adapter";
import { LogControllerDecorator } from "../decorators/log";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = () => {
	const salt = 12;
	const bcryptAdapter = new BcryptAdaper(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);

	const signUpController = new SignUpController(
		dbAddAccount,
		makeSignUpValidation()
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(signUpController, logMongoRepository);
};
