import { ErrorMiddleware } from "./middleware/error";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

require("dotenv").config();

export const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross-origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  }),
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
});

// Error handler
app.use(ErrorMiddleware);
