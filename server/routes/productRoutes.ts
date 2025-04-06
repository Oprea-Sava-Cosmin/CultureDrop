import {Router} from 'express';
import {createProduct, getProducts, getFilteredProducts, deleteProduct, updateProduct, getProductCount, getProduct} from '../controllers/productController';
import {verifyAdmin} from '../config/auth';

const router = Router();



router.get('/', getProducts);
router.get('/filter', getFilteredProducts);
router.get('/count', getProductCount);

router.post('/create', verifyAdmin, createProduct);

router.get('/:id', getProduct);
router.put('/:id', verifyAdmin, updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);


export default router;