import {Router} from 'express';
import { createTransaction, getTransactionCount, getTransactionsValue } from '../controllers/transactionController';

const router = Router();

router.get('/value', getTransactionsValue);
router.get('/count', getTransactionCount);

router.post('/', createTransaction);


export default router;