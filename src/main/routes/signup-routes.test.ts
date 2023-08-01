import request from "supertest";
import app from "../config/app";

describe("Sign up routes", () => {
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
