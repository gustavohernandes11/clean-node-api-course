import { Request, Response, NextFunction } from "express";

const cors = (_: Request, res: Response, next: NextFunction) => {
	res.set("access-control-allow-origin", "*");
	res.set("access-control-allow-headers", "*");
	res.set("access-control-allow-methods", "*");
	next();
};
export default cors;