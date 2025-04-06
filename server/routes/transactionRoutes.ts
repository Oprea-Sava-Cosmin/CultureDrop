import {Router} from 'express';
import { 
    createTransaction, 
    getTransactionCount, 
    getTransactionsValue,
    getAllTransactions 
} from '../controllers/transactionController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/value', getTransactionsValue);
router.get('/count', getTransactionCount);
router.get('/all', verifyToken, getAllTransactions);

router.post('/', createTransaction);

export default router;