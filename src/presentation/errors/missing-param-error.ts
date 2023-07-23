export class MissingParamError extends Error {
	constructor(missingParam: string) {
		super(`missing param: ${missingParam}`);
		this.name = "MissingParamError";
	}
}
