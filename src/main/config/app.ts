import server from "express";
import setupMiddlawares from "./middlewares";
import setupRoutes from "./routes";

const app = server();
setupMiddlawares(app);
setupRoutes(app);
export default app;
