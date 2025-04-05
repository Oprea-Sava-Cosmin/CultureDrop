import {Request, Response} from 'express';
import Product from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            name,
            category,
            subCategory,
            price,
            size,
            stock,
            image,
            description,
            culture,
            tags,
            featured
        } = req.body;

        if(!name || !category || !price || !stock || !image || !description || !tags || !culture) {
            return res.status(400).json({message: 'All fields are required'});
        }

        
    } catch (error) {

    }
}