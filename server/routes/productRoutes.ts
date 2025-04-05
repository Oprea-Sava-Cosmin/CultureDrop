import {Router} from 'express';
import {createProduct, getProducts} from '../controllers/productController';
import {verifyAdmin} from '../config/auth';

const router = Router();

router.post('/create', verifyAdmin, createProduct);

router.get('/', getProducts);

export default router;