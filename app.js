import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import {
  errorHandler,
  throwTestError,
  unknownEndpoint,
} from "./middleware/misc.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { booksRouter, pingRouter } from "./controllers/index.js";

export default function buildServer() {
  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
    app.use(rateLimiter);
    app.use(helmet());
    app.use(cors());
  } else if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else if (process.env.NODE_ENV === "test") {
    app.use("/throwerror", throwTestError);
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/ping", pingRouter);
  app.use("/books", booksRouter);
  app.use(unknownEndpoint);
  app.use(errorHandler);
  return app;
}