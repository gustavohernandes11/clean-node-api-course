import server from "express";

export const app = server();
const port = 3000;
app.listen(port, () => `Server is listening the port ${port}`);
