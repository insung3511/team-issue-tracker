// TODO: implement authenticate middleware
import { Request, Response, NextFunction } from 'express';

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO: implement JWT verification and req.userId injection
  next();
}
