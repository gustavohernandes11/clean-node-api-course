import bcrypt from "bcrypt";
import { IEncrypter } from "data/protocols/encrypter";

export class BcryptAdaper implements IEncrypter {
	constructor(protected readonly salt: number) {
		this.salt = salt;
	}
	async encrypt(value: string): Promise<string> {
		return bcrypt.hash(value, this.salt);
	}
}
