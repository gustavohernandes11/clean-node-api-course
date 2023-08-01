import { Request, Response, NextFunction } from "express";

const contentType = (_: Request, res: Response, next: NextFunction) => {
	res.type("json");
	next();
};
export default contentType;
