import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env')});

export const connectDB = async ():
Promise<void> => {
    try {
        console.log('Connecting to MongoDB...');

        const connect = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB connected successfully`);
    }
    catch (err) {
        console.log('Error connecting to database: ', err);
        process.exit(1);
    }
};