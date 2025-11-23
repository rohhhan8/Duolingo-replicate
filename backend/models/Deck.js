const mongoose = require('mongoose');

// Card Schema (subdocument)
const cardSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, 'Question is required'],
            trim: true,
            minlength: [3, 'Question must be at least 3 characters long'],
        },
        answer: {
            type: String,
            required: [true, 'Answer is required'],
            trim: true,
            minlength: [1, 'Answer cannot be empty'],
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty is required'],
            enum: {
                values: ['easy', 'medium', 'hard'],
                message: 'Difficulty must be easy, medium, or hard',
            },
            lowercase: true,
        },
    },
    { _id: true } // Each card gets its own _id
);

// Deck Schema
const deckSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: [true, 'Topic is required'],
            trim: true,
            unique: true,
            minlength: [2, 'Topic must be at least 2 characters long'],
            maxlength: [100, 'Topic cannot exceed 100 characters'],
        },
        category: {
            type: String,
            default: 'General',
            trim: true,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        cards: {
            type: [cardSchema],
            required: [true, 'Cards array is required'],
            validate: {
                validator: function (cards) {
                    return cards && cards.length > 0;
                },
                message: 'Deck must contain at least one card',
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true, // Cannot be changed after creation
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Indexes for performance
// Note: topic already has an index due to unique: true
deckSchema.index({ createdAt: -1 }); // Index for sorting by newest

// Instance method to get card count
deckSchema.methods.getCardCount = function () {
    return this.cards.length;
};

// Static method to find deck by topic (case-insensitive)
deckSchema.statics.findByTopic = function (topic) {
    return this.findOne({
        topic: { $regex: new RegExp(`^${topic}$`, 'i') },
    });
};

// Virtual property for formatted creation date
deckSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

// Ensure virtuals are included when converting to JSON
deckSchema.set('toJSON', { virtuals: true });
deckSchema.set('toObject', { virtuals: true });

const Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
