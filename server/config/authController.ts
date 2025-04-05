import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const signup = async (req: Request, res: Response) => {
    const {firstName, lastName, username, email, password, confirmPassword} = req.body;
    if(!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({message: 'All fields are required'});
    }
    if(password.length < 6) {
        return res.status(400).json({message: 'Password must be at least 6 characters long'});
    }
    if(password == confirmPassword) {
        try {
            const existingEmail = await User.findOne({email});
            const existingUsername = await User.findOne({username});
            if(existingEmail) {
                return res.status(400).json({message: 'User with this email already exists'});
            }
            if(existingUsername) {
                return res.status(400).json({message: 'Username is already taken'});
            }
    
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword
            });
    
            await user.save();
    
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET as string, {expiresIn: '24h'});
            res.status(201).json({message: 'User created successfully', token, user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        } catch(error) {
            res.status(500).json({message: 'Something went wrong'});
        }    
    }
    else {
        return res.status(400).json({message: 'Passwords do not match'});
    }
    
}


export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    if(!username) {
        res.status(400).json({message: 'Username must be provided!'});
    }
    if(!password) {
        res.status(400).json({message: 'Password must be provided!'});
    }

    try {
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({message: 'Login not successful', error: 'User not found!'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); 
        if(!isPasswordValid) {
            return res.status(401).json({message: 'Invalid credentials!'});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET as string, {expiresIn: '24h'});
        res.json({token, user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    }
    catch (error) {
        res.status(500).json({message: 'An error occured!'});
    }
}

export const checkAdminStatus = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if(!token) {
            return res.json({isAdmin: false, adminToken: null});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId: string};
        const user = await User.findById(decoded.userId);

        if(!user || !user.isAdmin) {
            return res.json({isAdmin: false, adminToken: null});
        }

        const adminToken = jwt.sign({userId: user._id, isAdmin: true}, process.env.JWT_SECRET as string, {expiresIn: '24h'});

        return res.json({
            isAdmin: true,
            adminToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    }
    catch (error) {
        return res.json({isAdmin: false, adminToken: null});
    }
}