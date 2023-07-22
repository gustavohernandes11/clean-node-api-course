import { SignUpController } from "./signup";

describe("SignUpController", () => {
	it("should return 400 if name was not provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				email: "jhondoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new Error("missing param: name"));
	});
	it("should return 400 if email was not provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: "Jhon Doe",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new Error("missing param: email"));
	});
});
