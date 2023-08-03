export class ServerError extends Error {
	constructor(stack: string = "An server error occurred") {
		super("Internal Server Error");
		this.name = "ServerError";
		this.stack = stack;
	}
}
