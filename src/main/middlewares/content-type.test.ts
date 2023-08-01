import app from "../config/app";
import request from "supertest";

describe("Content type", () => {
	it("should return json as default", async () => {
		app.get("/test_content_type", (_, res) => {
			res.send("");
		});

		await request(app)
			.get("/test_content_type")
			.expect("content-type", /json/);
	});
});
