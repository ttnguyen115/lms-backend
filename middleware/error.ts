import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal server error";

  // wrong mongodb id error
  if (error.name === "CastError") {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (error.code === 11_000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (error.name === "JwtWebTokenError") {
    const message = `JSON Web Token is invalid, try again`;
    error = new ErrorHandler(message, 400);
  }

  // JWT expired error
  if (error.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired, try again`;
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
