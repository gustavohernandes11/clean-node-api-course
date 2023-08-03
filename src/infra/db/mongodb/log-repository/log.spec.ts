import { MongoHelper } from "../helpers/mongo-helper";
import { Collection } from "mongodb";
import { LogMongoRepository } from "./log";
import env from "../../../../main/config/env";

let errorCollection: Collection;
describe("Account Mongo Repository", () => {
	beforeAll(async () => {
		await MongoHelper.connect(env.mongoUrl);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		errorCollection = MongoHelper.getCollection("errors");
		await errorCollection.deleteMany({});
	});
	it("should log the error log on the database", async () => {
		const sut = new LogMongoRepository();
		await sut.logError("any_error");
		const count = await errorCollection.countDocuments();
		expect(count).toBe(1);
	});
});
