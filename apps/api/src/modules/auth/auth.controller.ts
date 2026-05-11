import { fromNodeHeaders } from 'better-auth/node';
import { Request, Response } from 'express';
import { auth } from './auth.config.js';

export class AuthController {
  async me(req: Request, res: Response) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
  }
}
