const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const Deck = require('./models/Deck');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Session Config
const isProduction = process.env.NODE_ENV === 'production';

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret_key_here',
        resave: false,
        saveUninitialized: false,
        proxy: true, // Trust proxy for Render
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: isProduction, // HTTPS only in production
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-domain in production
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`,
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // 1. Check if user exists by Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // 2. Check if user exists by Email (to prevent duplicate key error)
                    const email = profile.emails?.[0]?.value;
                    if (email) {
                        user = await User.findOne({ email: email });
                        if (user) {
                            // Link Google ID to existing user
                            user.googleId = profile.id;
                            user.displayName = user.displayName || profile.displayName || email?.split('@')[0] || 'User';
                            user.photo = profile.photos?.[0]?.value || user.photo;
                            await user.save();
                            return done(null, user);
                        }
                    }

                    // 3. Create new user
                    user = await new User({
                        googleId: profile.id,
                        displayName: profile.displayName || email?.split('@')[0] || 'User',
                        email: email,
                        photo: profile.photos?.[0]?.value,
                    }).save();
                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
}

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB Connection
const dbName = process.env.DB_NAME || 'test';
const mongoUri = process.env.MONGODB_URI.includes('?')
    ? `${process.env.MONGODB_URI}&dbName=${dbName}`
    : `${process.env.MONGODB_URI}/${dbName}`;

mongoose
    .connect(mongoUri)
    .then(() => {})
    .catch((err) => {
        process.exit(1);
    });


app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/`);
    }
);

app.get('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Logout failed' });
        }
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/`);
    });
});

app.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

app.post('/api/generate', async (req, res) => {
    try {
        const { topic } = req.body;

        // Validation
        if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Topic is required and must be a non-empty string',
            });
        }

        const normalizedTopic = topic.trim();

        // Step 0: Check Deck Limit (Max 15)
        const deckCount = await Deck.countDocuments();
        if (deckCount >= 15) {
            // Check if the topic already exists (allow re-generating/fetching existing even if full)
            const existingDeckCheck = await Deck.findOne({
                topic: { $regex: new RegExp(`^${normalizedTopic}$`, 'i') },
            });

            if (!existingDeckCheck) {
                return res.status(403).json({
                    success: false,
                    error: 'Deck limit reached (15). Please delete some decks to create new ones.',
                });
            }
        }

        // Step 1: Check if deck already exists (case-insensitive)
        const existingDeck = await Deck.findOne({
            topic: { $regex: new RegExp(`^${normalizedTopic}$`, 'i') },
        });

        if (existingDeck) {
            return res.status(200).json({
                success: true,
                source: 'cache',
                data: existingDeck,
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an expert educational AI.
        
User Topic: "${normalizedTopic}"

Task: Generate exactly 10 flashcards strictly focused on ACRONYMS and ABBREVIATIONS related to the topic.

Requirements:
1.  **Summarize Topic**: Create a short, concise title for the deck (e.g., "Computer Networks" instead of "history of computer networks...").
2.  **Categorize**: Assign a broad category (e.g., "Tech", "Science", "Medical", "Business", "General").
3.  **Flashcards**: Generate 10 cards.
    *   **Question**: The Acronym (e.g., "CPU").
    *   **Answer**: The Full Form + Brief definition (e.g., "Central Processing Unit - The brain of the computer").
    *   **Difficulty**: "easy", "medium", or "hard".

Output Format: Return ONLY a valid JSON object (no markdown):
{
  "topic": "Summarized Topic Name",
  "category": "Category Name",
  "cards": [
    { "question": "CPU", "answer": "Central Processing Unit...", "difficulty": "easy" }
  ]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let generatedText = response.text();

        // Clean up the response (remove markdown code blocks if present)
        generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Step 3: Parse JSON with error handling
        let parsedData;
        try {
            parsedData = JSON.parse(generatedText);
        } catch (parseError) {
            return res.status(500).json({
                success: false,
                error: 'Failed to parse AI response. Please try again.',
                details: process.env.NODE_ENV === 'development' ? generatedText : undefined,
            });
        }

        // Step 4: Validate the parsed data
        if (!parsedData || !Array.isArray(parsedData.cards) || parsedData.cards.length === 0) {
            return res.status(500).json({
                success: false,
                error: 'AI returned invalid data format',
            });
        }

        const cards = parsedData.cards;

        // Validate each card has required fields
        const isValid = cards.every(
            (card) =>
                card.question &&
                card.answer &&
                card.difficulty &&
                ['easy', 'medium', 'hard'].includes(card.difficulty.toLowerCase())
        );

        if (!isValid) {
            return res.status(500).json({
                success: false,
                error: 'AI returned cards with missing or invalid fields',
            });
        }

        // Step 5: Save to MongoDB
        const newDeck = new Deck({
            topic: parsedData.topic || normalizedTopic, // Use summarized topic
            category: parsedData.category || 'General',
            cards: cards,
        });

        await newDeck.save();

        return res.status(201).json({
            success: true,
            source: 'ai',
            data: newDeck,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

app.get('/api/decks', async (req, res) => {
    try {
        const decks = await Deck.find()
            .sort({ createdAt: -1 }) // Newest first
            .select('-__v'); // Exclude version key

        return res.status(200).json({
            success: true,
            count: decks.length,
            data: decks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch decks',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

app.delete('/api/decks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid deck ID',
            });
        }

        const deletedDeck = await Deck.findByIdAndDelete(id);

        if (!deletedDeck) {
            return res.status(404).json({
                success: false,
                error: 'Deck not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Deck deleted successfully',
            data: deletedDeck,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to delete deck',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

app.patch('/api/decks/:id/progress', async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid deck ID' });
        }

        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return res.status(400).json({ success: false, error: 'Progress must be a number between 0 and 100' });
        }

        const updatedDeck = await Deck.findByIdAndUpdate(
            id,
            { progress },
            { new: true } // Return updated document
        );

        if (!updatedDeck) {
            return res.status(404).json({ success: false, error: 'Deck not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Progress updated',
            data: updatedDeck,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to update progress' });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Prep.ai Backend is running',
        timestamp: new Date().toISOString(),
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: 'Something went wrong',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

app.listen(PORT, () => {});
