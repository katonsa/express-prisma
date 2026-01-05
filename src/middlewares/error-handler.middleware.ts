import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";

// Global error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false);
  }

  const apiError = error as ApiError;
  const response = {
    success: false,
    statusCode: apiError.statusCode,
    message: apiError.message,
    ...(process.env.NODE_ENV === "development" && { stack: apiError.stack }),
  };

  // @TODO: move to logger instead of console print (statusCode, message, originalUrl, method, ip);
  console.error(`${apiError.statusCode} - ${apiError.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(apiError.statusCode).json(response);
};

// 404 Not Found middleware
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};
