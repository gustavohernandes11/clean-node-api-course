import {
	IAccountModel,
	IAddAccount,
	IAddAccountModel,
	IAddAccountRepository,
	IEncrypter,
} from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {
	private readonly encrypter;
	private readonly addAccountRepository;
	constructor(
		encrypter: IEncrypter,
		addAccountRepository: IAddAccountRepository
	) {
		this.encrypter = encrypter;
		this.addAccountRepository = addAccountRepository;
	}
	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const hashedPassword = await this.encrypter.encrypt(
			accountData.password
		);
		const account = await this.addAccountRepository.add(
			Object.assign({}, accountData, { password: hashedPassword })
		);
		return account;
	}
}
