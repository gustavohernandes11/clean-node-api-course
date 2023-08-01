import { Router } from "express";

export default (router: Router) => {
	router.post("/signup", (_, res) => {
		res.json({ ok: "ok" });
	});
};
