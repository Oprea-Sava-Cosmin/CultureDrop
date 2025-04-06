import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    orderNumber: {
        type: Number,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

transactionSchema.pre('save', async function (next) {
    try {
        if(this.isNew) {
            const lastTransaction = await (this.constructor as any).findOne({}, {}, {sort: {orderNumber: -1}});
            this.orderNumber = lastTransaction ? lastTransaction.orderNumber + 1 : 1;
        }
        next();
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});

export default mongoose.model('Transaction', transactionSchema);