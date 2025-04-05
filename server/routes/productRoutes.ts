import {Router} from 'express';
import {createProduct, getProducts, getFilteredProducts, deleteProduct, updateProduct} from '../controllers/productController';
import {verifyAdmin} from '../config/auth';

const router = Router();

router.post('/create', verifyAdmin, createProduct);

router.get('/', getProducts);

router.get('/filter', getFilteredProducts);

router.put('/:id', verifyAdmin, updateProduct);

router.delete('/:id', verifyAdmin, deleteProduct);

export default router;