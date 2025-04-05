import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/database';
import deepseekRoutes from './routes/deepseek';

const PORT = process.env.PORRT || 5000;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// API Routes
app.use('/api/deepseek', deepseekRoutes);

app.get('/', (req, res) => {
    res.send('Rythm Vogue API running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});