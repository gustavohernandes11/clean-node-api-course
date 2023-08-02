import { LogControllerDecorator } from "./log";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
} from "presentation/protocols";

interface SutType {
	sut: LogControllerDecorator;
	controllerStub: IController;
}

describe("Log Controller Decorator", () => {
	function makeSut(): SutType {
		class ControllerStub implements IController {
			handle(_: IHttpRequest): Promise<IHttpResponse> {
				return new Promise((resolve) =>
					resolve({ statusCode: 200, body: "" })
				);
			}
		}
		const controllerStub = new ControllerStub();
		const sut = new LogControllerDecorator(controllerStub);

		return { controllerStub, sut };
	}

	it("should call the handle method from the controller", async () => {
		const { sut, controllerStub } = makeSut();
		const controllerSpy = jest.spyOn(controllerStub, "handle");

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
