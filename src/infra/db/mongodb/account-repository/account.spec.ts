import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";
import { Collection } from "mongodb";

let accountCollection: Collection;
describe("Account Mongo Repository", () => {
	beforeAll(async () => {
		await MongoHelper.connect("mongodb://localhost:27017");
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});
	it("should return an account on sucess", async () => {
		const sut = new AccountMongoRepository();
		const account = await sut.add({
			email: "tal",
			name: "tal",
			password: "asdf",
		});
		expect(account).toBeTruthy;
		expect(account.id).toBeTruthy;
		expect(account.name).toBe("tal");
		expect(account.email).toBe("tal");
		expect(account.password).toBe("asdf");
	});
});
