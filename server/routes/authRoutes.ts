import { Router, Request, Response } from 'express';
import { signup, login, checkAdminStatus, getUserCount } from '../config/authController';
import {verifyAdmin} from '../config/auth';

const router = Router();

router.get('/count', getUserCount);

router.post('/signup', async (req: Request, res: Response) => {
    await signup(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
    await login(req, res);
});

router.get('/check-admin', async (req: Request, res: Response) => {
    await checkAdminStatus(req, res);
});

export default router;