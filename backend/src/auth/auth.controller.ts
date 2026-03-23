import { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerResult = await registerUser(req.body.name, req.body.email, req.body.password);
        res.status(201).json({ success: true, data: registerResult });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginResult = await loginUser(req.body.email, req.body.password);
        res.status(200).json({ success: true, data: loginResult });
    } catch (error) {
        next(error);
    }
};
