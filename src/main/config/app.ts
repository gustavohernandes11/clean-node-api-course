import server from "express";
import setupMiddlawares from "./middlewares";

const app = server();
setupMiddlawares(app);
export default app;
