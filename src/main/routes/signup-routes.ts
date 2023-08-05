import { Router } from "express";
import { adaptRoute } from "../../main/adapters/express-route-adapter";
import { makeSignUpController } from "../factories/signup-controller-factory";

export default (router: Router) => {
	router.post("/signup", adaptRoute(makeSignUpController()));
};
