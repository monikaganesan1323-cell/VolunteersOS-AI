import { Request, Response, NextFunction } from "express";

// Wrap async route handlers so thrown errors reach errorHandler instead of hanging the request.
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  res.status(status).json({ error: message });
}
