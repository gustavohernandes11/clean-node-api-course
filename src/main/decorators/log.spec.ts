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
	const httpRequest: IHttpRequest = {
		body: {
			name: "johndoe",
			email: "johndoe@gmail.com",
			password: 123,
			confirmedPassword: 123,
		},
	};

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

	function makeSut(): SutType {
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

		await sut.handle(httpRequest);

		expect(controllerSpy).toHaveBeenCalledWith(httpRequest);
	});

	it("should return the same response as the controller", async () => {
		const { sut } = makeSut();

		const response = await sut.handle(httpRequest);

		expect(response).toEqual({ statusCode: 200, body: "" });
	});

	it("should log error when the controller throws a status 500", async () => {
		const { sut, controllerStub, logErrorRepository } = makeSut();
		const fakeError = new Error();
		fakeError.stack = "stack error message";

		jest.spyOn(controllerStub, "handle").mockImplementationOnce(
			() => new Promise((resolve) => resolve(serverError(fakeError)))
		);
		const logSpy = jest.spyOn(logErrorRepository, "log");

		await sut.handle(httpRequest);

		expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
	});
});
