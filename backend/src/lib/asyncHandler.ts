import type { NextFunction, Request, Response } from 'express';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Wraps an async Express handler so a rejected promise is forwarded to the
// error-handling middleware instead of crashing the process unhandled.
export const asyncHandler = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  handler(req, res, next).catch(next);
};
