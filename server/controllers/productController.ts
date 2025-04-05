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

        const product = new Product({
            name,
            category,
            subCategory: subCategory || null,
            price,
            size: size || null,
            stock,
            image,
            description,
            culture,
            tags,
            featured: featured || false
        });

        await product.save();

        res.status(201).json({message: 'Product created successfully', product});
    } catch (error) {
        console.error('Error creating product: ', error);
        res.status(500).json({message: 'Error creating product'});
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).json({message: 'Error fetchign products'});
    }
};

export const getFilteredProducts = async (req: Request, res: Response) => {
    try {
        const {category, culture} = req.query;
        let query = {};

        if(category) {
            query = {...query, category};
        }
        if(culture) {
            query = {...query, culture};
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        console.error('Error fetching filtered products: ', error);
        res.status(500).json({message: 'Error fetching filtered products'});
    }
};