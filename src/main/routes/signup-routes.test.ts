import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

let accountCollection: Collection;
describe("Sign up routes", () => {
	beforeAll(async () => {
		await MongoHelper.connect(
			process.env.MONGO_URL || "mongodb://localhost:27017"
		);
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
				name: "any_name",
				email: "any_email",
				password: "any_password",
				passwordConfirmation: "any_password",
			})
			.expect(200);

		expect;
	});
});
