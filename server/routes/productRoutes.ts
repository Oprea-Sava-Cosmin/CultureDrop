import {Router} from 'express';
import {createProduct, getProducts, getFilteredProducts} from '../controllers/productController';
import {verifyAdmin} from '../config/auth';

const router = Router();

router.post('/create', verifyAdmin, createProduct);

router.get('/', getProducts);

router.get('/filter', getFilteredProducts);

export default router;