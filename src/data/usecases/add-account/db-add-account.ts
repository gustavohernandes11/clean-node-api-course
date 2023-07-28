import { IEncrypter } from "data/protocols/encrypter";
import { IAccountModel } from "domain/models/account";
import { IAddAccount, IAddAccountModel } from "domain/usecases/add-account";

export class DbAddAccount implements IAddAccount {
	private readonly encrypter;
	constructor(encrypter: IEncrypter) {
		this.encrypter = encrypter;
	}
	async add(account: IAddAccountModel): Promise<IAccountModel> {
		await this.encrypter.encrypt(account.password);
		return new Promise((resolve) =>
			resolve(null as unknown as IAccountModel)
		);
	}
}
