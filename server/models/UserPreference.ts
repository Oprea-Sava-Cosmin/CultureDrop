import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    preferences: [{
        type: String,
        enum: [
            // Style preferences
            'Streetwear', 'Urban', 'Vintage', 'Modern', 'Minimalist', 'Grunge', 'Punk',
            // Music genre preferences
            'Hip-hop', 'Rock', 'Jazz', 'Electronic', 'Pop', 'Indie', 'Metal', 'Country', 'Disco', 'Folk',
            // Region preferences
            'Asian', 'African', 'European', 'American', 'Middle Eastern', 'South American', 'Latin American', 'Pacific Islander',
            // Aesthetic preferences
            'Retro', 'Futuristic', 'Classic', 'Alternative', 'Underground',
            // Other preferences
            'Artist Collab', 'Limited Drop', 'Exclusive'
        ]
    }],
    searchHistory: [{
        query: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    lastInteraction: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for faster lookups
userPreferenceSchema.index({ userId: 1 });

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;