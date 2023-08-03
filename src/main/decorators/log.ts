import { ILogErrorRepository } from "data/protocols/log-error-repository";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
} from "presentation/protocols";

export class LogControllerDecorator implements IController {
	constructor(
		private readonly controller: IController,
		private readonly logErrorRepository: ILogErrorRepository
	) {}
	async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		const response = await this.controller.handle(httpRequest);
		if (response.statusCode === 500) {
			this.logErrorRepository.log(response.body.stack);
		}
		return response;
	}
}
