import app from "../config/app";
import request from "supertest";

describe("Cors", () => {
	it("should add the correct properties in the header", async () => {
		app.get("/test_cors", (_, res) => {
			res.send();
		});

		await request(app)
			.get("/test_cors")
			.expect("access-control-allow-origin", "*")
			.expect("access-control-allow-headers", "*")
			.expect("access-control-allow-methods", "*");
	});
});
