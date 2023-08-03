import { ILogErrorRepository } from "../../data/protocols/log-error-repository";
import { LogControllerDecorator } from "./log";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
} from "../../presentation/protocols";
import { serverError } from "../../presentation/helpers/http-helpers";

interface SutType {
	sut: LogControllerDecorator;
	controllerStub: IController;
	logErrorRepository: ILogErrorRepository;
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
		class LogErrorRepositoryStub implements ILogErrorRepository {
			async log(_: string) {
				return new Promise<void>((resolve) => resolve());
			}
		}
		const logErrorRepository = new LogErrorRepositoryStub();
		const controllerStub = new ControllerStub();
		const sut = new LogControllerDecorator(
			controllerStub,
			logErrorRepository
		);

		return { controllerStub, sut, logErrorRepository };
	}

	it("should call the handle method from the controller", async () => {
		const { sut, controllerStub } = makeSut();
		const controllerSpy = jest.spyOn(controllerStub, "handle");

		const httpRequest: IHttpRequest = {
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
	it("should return the same response as the controller", async () => {
		const { sut } = makeSut();

		const httpRequest: IHttpRequest = {
			body: {
				name: "johndoe",
				email: "johndoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		const response = await sut.handle(httpRequest);

		expect(response).toEqual({ statusCode: 200, body: "" });
	});
	it("should log error when the controller trows a status 500", async () => {
		const { sut, controllerStub, logErrorRepository } = makeSut();

		const fakeError = new Error();
		fakeError.stack = "stack error message";
		const error = serverError(fakeError);

		jest.spyOn(controllerStub, "handle").mockImplementationOnce(
			() => new Promise((resolve) => resolve(error))
		);
		const logSpy = jest.spyOn(logErrorRepository, "log");

		const httpRequest: IHttpRequest = {
			body: {
				name: "johndoe",
				email: "johndoe@gmail.com",
				password: 123,
				confirmedPassword: 123,
			},
		};
		await sut.handle(httpRequest);

		expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
	});
});
