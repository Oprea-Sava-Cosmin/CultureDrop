import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    size: [{
        type: String,
    }],
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    tags: [{
        type: String,
    }],
    featured: {
        type: Boolean,
        default: false
    },
    culture: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// productSchema.index({name: 'text', description: 'text', tags: 'text'});

const Product = mongoose.model('Product', productSchema);
export default Product;