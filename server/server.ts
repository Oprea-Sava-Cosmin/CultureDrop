import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/database';

const PORT = process.env.PORRT || 5000;

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Rythm Vogue API running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});