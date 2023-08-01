import request from "supertest";
import app from "../config/app";

describe("Body parser", () => {
	it("should parse the body on put and post methods", async () => {
		app.post("/test_body_parser", (req, res) => {
			res.send(req.body);
		});

		await request(app)
			.post("/test_body_parser")
			.send({ name: "JhonDoe" })
			.expect({ name: "JhonDoe" });

		expect;
	});
});
