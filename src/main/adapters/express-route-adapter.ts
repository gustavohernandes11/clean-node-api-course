import { Response, Request } from "express";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
} from "../../presentation/protocols";

export function adaptRoute(controller: IController) {
	return async (req: Request, res: Response) => {
		const httpRequest: IHttpRequest = {
			body: req.body,
		};
		const httpResponse: IHttpResponse = await controller.handle(
			httpRequest
		);
		res.status(httpResponse.statusCode).json();
	};
}
