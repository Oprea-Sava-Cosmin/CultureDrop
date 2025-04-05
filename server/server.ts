import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import deepseekRoutes from './routes/deepseek';

import {connectDB} from './config/database';
import authRoutes from './routes/authRoutes';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

connectDB();

// API Routes
app.use('/api/deepseek', deepseekRoutes);

app.get('/', (req, res) => {
    res.send('Rythm Vogue API running');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});