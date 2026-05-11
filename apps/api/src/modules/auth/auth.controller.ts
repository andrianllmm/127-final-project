import type { Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.config.js';

export class AuthController {
  me = async (req: Request, res: Response): Promise<Response> => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json(session);
  };
}
