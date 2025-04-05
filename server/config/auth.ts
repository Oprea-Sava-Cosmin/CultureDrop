import jwt from 'jsonwebtoken';
import User from '../models/User';
import {Request, Response, NextFunction} from 'express';

export interface AuthRequest extends Request {
    user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).send({error: 'Please authenticate.'});
    }
}

export const verifyAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if(!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId: string};
        const user = await User.findById(decoded.userId);

        if(!user || !user.isAdmin) {
            return res.status(403).json({message: 'Access denied. Admin rights required!'});
        }

        req.user = user;
        next();
    }   catch (error) {
        res.status(401).json({message: 'Authentication failed'});
    }
};