import express from "express";
import type { Application } from "express";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error-handler.middleware.js";

const app: Application = express();

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
