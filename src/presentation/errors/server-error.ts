export class ServerError extends Error {
	constructor() {
		super("An server error occurred");
		this.name = "ServerError";
	}
}
