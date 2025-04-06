import {Request, Response} from 'express';
import Transaction from '../models/Payment';
import jwt from 'jsonwebtoken';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const {amount} = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({message: 'No token provided'});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId: string};

        const transaction = new Transaction({
            userId: decoded.userId,
            amount: amount
        });

        await transaction.save();
        res.status(201).json({message: 'Transaction created successfully. ', orderNumber: transaction.orderNumber});
    } catch (error) {
        console.error('Error creating transaction: ', error);
        res.status(500).json({message: 'Error creating transaction'});
    }
};

export const getTransactionsValue = async (req: Request, res: Response) => {
    try {
        const totalAmount = await Transaction.aggregate([
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const value = totalAmount.length > 0 ? totalAmount[0].total : 0;
        res.json({value});
    } catch (error) {
        console.error('Error getting transactions value: ', error);
        res.status(500).json({message: 'Error getting transactions value'});
    }
};

export const getTransactionCount = async (req: Request, res: Response) => {
    try {
        const count = await Transaction.countDocuments();
        res.json({count});
    } catch (error) {
        console.error('Error counting transactions: ', error);
        res.status(500).json({message: 'Error counting transactions'});
    }
}