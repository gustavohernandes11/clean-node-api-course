import { LogControllerDecorator } from "./log";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
} from "presentation/protocols";

describe("Log Controller Decorator", () => {
	it("should call the handle method from the controller", async () => {
		class ControllerStub implements IController {
			handle(_: IHttpRequest): Promise<IHttpResponse> {
				return new Promise((resolve) =>
					resolve({ statusCode: 200, body: "" })
				);
			}
		}
		const controllerStub = new ControllerStub();
		const controllerSpy = jest.spyOn(controllerStub, "handle");
		const sut = new LogControllerDecorator(controllerStub);

		const httpRequest = {
			body: {
				name: "johndoe",
				email: "johndoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		await sut.handle(httpRequest);

		expect(controllerSpy).toHaveBeenCalledWith(httpRequest);
	});
});
