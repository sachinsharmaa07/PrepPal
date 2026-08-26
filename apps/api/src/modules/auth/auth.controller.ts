import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { success, error } from '../../common/response/envelope';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(success(result));
    } catch (err: any) {
      if (err.message === 'User already exists') {
        res.status(409).json(error('CONFLICT', err.message));
      } else {
        console.error(err);
        res.status(500).json(error('INTERNAL_ERROR', 'Registration failed'));
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(success(result));
    } catch (err: any) {
      if (err.message === 'Invalid email or password') {
        res.status(401).json(error('UNAUTHORIZED', err.message));
      } else {
        console.error(err);
        res.status(500).json(error('INTERNAL_ERROR', 'Login failed'));
      }
    }
  };

  googleLogin = async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      const result = await this.authService.googleLogin(idToken);
      res.status(200).json(success(result));
    } catch (err: any) {
      console.error('Google login error:', err);
      res.status(401).json(error('UNAUTHORIZED', err.message || 'Google login failed'));
    }
  };
}
