# Prep.ai Backend

AI-powered Flashcard & Quiz Generator Backend with **Lazy Loading & Caching**

## 🚀 Features

- **Smart Caching**: Checks MongoDB before calling AI API to save costs and improve speed
- **Google Gemini AI**: Generates high-quality flashcards automatically
- **Robust Error Handling**: Gracefully handles JSON parsing errors and validation
- **RESTful API**: Clean, well-documented endpoints
- **MongoDB Integration**: Persistent storage with Mongoose ODM

## 📋 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Language**: JavaScript

## 🛠️ Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your credentials:
   - `MONGODB_URI`: Your MongoDB connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔑 Getting API Keys

### MongoDB Atlas (Free Tier)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string from "Connect" → "Connect your application"

### Google Gemini API (Free Tier)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## 📡 API Endpoints

### 1. Generate/Fetch Deck
**POST** `/api/generate`

Generates a new deck or returns cached version if exists.

**Request Body**:
```json
{
  "topic": "Photosynthesis"
}
```

**Response (Cache HIT)**:
```json
{
  "success": true,
  "source": "cache",
  "data": {
    "_id": "...",
    "topic": "Photosynthesis",
    "cards": [
      {
        "question": "What is photosynthesis?",
        "answer": "The process by which plants convert light energy into chemical energy",
        "difficulty": "easy"
      }
    ],
    "createdAt": "2025-11-22T05:24:24.000Z"
  }
}
```

**Response (Cache MISS - AI Generated)**:
```json
{
  "success": true,
  "source": "ai",
  "data": { /* same structure as above */ }
}
```

### 2. Get All Decks
**GET** `/api/decks`

Returns all generated decks, sorted by newest first.

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "topic": "Photosynthesis",
      "cards": [...],
      "createdAt": "2025-11-22T05:24:24.000Z"
    }
  ]
}
```

### 3. Health Check
**GET** `/api/health`

Check if the server is running.

**Response**:
```json
{
  "success": true,
  "message": "Prep.ai Backend is running",
  "timestamp": "2025-11-22T05:24:24.000Z"
}
```

## 🧠 How Lazy Loading & Caching Works

```
Request → Check MongoDB → Found? Return cached : Call Gemini AI → Parse & Validate → Save → Return
```

1. **Request arrives** with a topic
2. **Database check**: Case-insensitive search in MongoDB
3. **Cache HIT**: Return existing deck immediately
4. **Cache MISS**: Call Google Gemini API
5. **Parse & Validate**: Handle JSON parsing errors gracefully
6. **Save**: Store new deck in MongoDB for future requests
7. **Return**: Send generated deck to client

## 🛡️ Error Handling

The backend includes comprehensive error handling:

- ✅ **JSON Parse Errors**: Catches malformed AI responses
- ✅ **Validation Errors**: Ensures all required fields are present
- ✅ **Database Errors**: Handles connection and query issues
- ✅ **API Errors**: Graceful handling of Gemini API failures
- ✅ **Input Validation**: Validates request body parameters

## 📁 Project Structure

```
backend/
├── models/
│   └── Deck.js          # Mongoose schema
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Environment template
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

## 🔧 Database Schema

### Deck Model
```javascript
{
  topic: String (unique, required),
  cards: [
    {
      question: String (required),
      answer: String (required),
      difficulty: String (enum: ['easy', 'medium', 'hard'])
    }
  ],
  createdAt: Date (auto-generated)
}
```

## 🚦 Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Generate deck
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "JavaScript Promises"}'

# Get all decks
curl http://localhost:5000/api/decks
```

## 📝 Notes

- Topics are stored with case-insensitive uniqueness
- Each deck generates exactly 6 flashcards
- Difficulty levels are automatically distributed by AI
- The AI response is cleaned to remove markdown code blocks
- All dates are stored in ISO format

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Deck editing capabilities
- [ ] Custom card count
- [ ] Multiple AI model support
- [ ] Rate limiting
- [ ] Caching with Redis

## 📄 License

MIT License - feel free to use this project for learning and development.
