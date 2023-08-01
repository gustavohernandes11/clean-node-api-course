import request from "supertest";
import app from "../config/app";
import env from "../config/env";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

let accountCollection: Collection;
describe("Sign up routes", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL || env.mongoUrl);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});
	it("should return 200 on sucess", async () => {
		await request(app)
			.post("/api/signup")
			.send({
				name: "Gustavo",
				email: "gustavo.taldetal@gmail.com",
				password: "123",
				confirmedPassword: "123",
			})
			.expect(200);
	});
});
