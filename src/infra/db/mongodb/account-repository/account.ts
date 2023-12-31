import { IAddAccountRepository } from "data/protocols/add-account-repository";
import { IAccountModel } from "domain/models/account";
import { IAddAccountModel } from "domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements IAddAccountRepository {
	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const { insertedId } = await accountCollection.insertOne(accountData);

		const account = await accountCollection.findOne({ _id: insertedId });

		return MongoHelper.map(account);
	}
}
