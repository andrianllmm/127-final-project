import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';

export function requireOwnership(getOwnerId: (req: AuthRequest) => string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const ownerId = getOwnerId(req);

    if (ownerId !== user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    next();
  };
}
