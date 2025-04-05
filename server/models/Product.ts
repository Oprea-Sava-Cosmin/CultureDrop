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
        enum: ['Clothing', 'Music', 'Accessories', 'Limited Edition']
    },
    subCategory: {
        type: String,
        required: true,
        enum: ['T-Shirts', 'Hoodies', 'Pants', 'Jackets', 'Vinyl', 'Digital', 'Caps', 'Bags', 'Other']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    size: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
    }],
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    }, 
    tags: [{
        type: String,
        enum: [
            //Style Tags
            'Streetwear', 'Urban', 'Vintage', 'Modern', 'Minimalist', 'Grunge', 'Punk',
            //Music Genre Tags
            'Hip-hop', 'Rock', 'Jazz', 'Electronic', 'Pop', 'Indie', 'Metal', 'Country', 'Disco', 'Folk',
            //Region Tags
            'Asian', 'African', 'European', 'American', 'Middle Eastern', 'South American', 'Latin American', 'Pacific Islander',
            ///Aesthetic Tags
            'Retro', 'Futuristic', 'Classic', 'Alternative', 'Underground',
            //Collab Tags
            'Artist Collab', 'Limited Drop', 'Exclusive'
        ]
    }],
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// productSchema.index({name: 'text', description: 'text', tags: 'text'});

const Product = mongoose.model('Product', productSchema);
export default Product;