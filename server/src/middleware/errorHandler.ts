import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation error',
      errors: err.message
    });
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    res.status(409).json({
      message: 'A record with this value already exists'
    });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      message: 'Invalid ID format'
    });
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({ message });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Route not found' });
};
