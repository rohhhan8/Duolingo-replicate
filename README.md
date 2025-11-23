# 🚀 Prep.ai - AI-Powered Flashcard Generator

A premium full-stack application that generates intelligent flashcards using Google Gemini AI. Built with modern technologies and featuring a stunning UI with glassmorphism effects, 3D animations, and smart caching.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini 2.5 Flash to create intelligent flashcards
- ⚡ **Smart Caching**: MongoDB-based caching for instant deck loading
- 🎨 **Premium UI**: Glassmorphism design with smooth animations
- 🔄 **3D Flip Cards**: Interactive flashcards with 3D rotation effects
- 📊 **Progress Tracking**: Monitor your learning with skill progress bars
- 🔥 **Streak System**: Gamification with daily streak tracking
- 📱 **Responsive Design**: Works beautifully on all screen sizes
- 🎯 **Quiz Mode**: Test yourself with "Got it" / "Forgot" tracking

## 🏗️ Project Structure

```
flash-card-app/
├── backend/                    # Node.js + Express API
│   ├── models/
│   │   └── Deck.js            # Mongoose schema
│   ├── server.js              # Main server file
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                   # React + TypeScript UI
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── DeckCard.tsx
│   │   │   ├── QuizModal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   ├── services/
│   │   │   └── api.ts         # API service layer
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript interfaces
│   │   ├── App.tsx            # Main application
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd flash-card-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your MongoDB URI and Gemini API key

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Open the Application

Navigate to `http://localhost:5173` in your browser and start generating flashcards!

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Getting API Keys

- **MongoDB**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Google Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey) (Free tier available)

## 🎯 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Language**: JavaScript

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📡 API Endpoints

### Backend API (`http://localhost:5000/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Generate or fetch cached deck |
| GET | `/decks` | Get all decks (sorted by newest) |
| GET | `/health` | Health check |

### Example Request

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Photosynthesis"}'
```

## 🎨 Design Features

### Glassmorphism
- Frosted glass effect with backdrop blur
- Subtle borders and shadows
- Premium, modern aesthetic

### Animations
- **3D Flip**: Flashcards rotate on Y-axis (180deg)
- **Spring**: Deck cards bounce in with spring physics
- **Fade In**: Smooth opacity transitions
- **Slide Up**: Elements enter from bottom
- **Progress Bars**: Smooth fill animations

### Layout
- **3-Column Holy Grail**: Progress | Main Feed | Activity
- **Responsive Grid**: Masonry-style deck display
- **Fixed Height**: 100vh constraint for optimal UX

## 🎮 How to Use

1. **Enter a Topic**: Type any subject (e.g., "React Hooks", "World War II")
2. **Generate Deck**: Click the generate button or press Enter
3. **View Flashcards**: AI creates 6 flashcards with difficulty levels
4. **Start Quiz**: Click any deck to open the quiz modal
5. **Flip Cards**: Click the flashcard to see the answer (3D flip!)
6. **Track Progress**: Mark answers as "Got it" or "Forgot"
7. **Build Streak**: Generate decks daily to increase your streak

## 📊 Features Breakdown

### Left Panel - Progress Tracker
- Animated skill progress bars
- Total decks and cards count
- Color-coded progress indicators

### Center Panel - Main Feed
- Large glassmorphism input field
- Masonry grid of deck cards
- Loading skeletons during generation
- Empty state with call-to-action

### Right Panel - Activity
- Streak counter with fire icon
- Recent activity feed
- Relative timestamps (e.g., "2m ago")

### Quiz Modal
- Full-screen overlay
- 3D flip animation
- Progress bar
- Card navigation (Previous/Next)
- Answer tracking (Correct/Incorrect)
- Difficulty badges

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check your `MONGODB_URI` in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas

**Gemini API Error**
- Verify `GEMINI_API_KEY` is correct
- Check API quota limits

### Frontend Issues

**Tailwind Not Working**
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` configuration

**CORS Error**
- Backend CORS is enabled by default
- Check if backend is running on port 5000

## 📈 Future Enhancements

- [ ] Spaced repetition algorithm
- [ ] Export decks as PDF
- [ ] Deck sharing functionality
- [ ] Mobile app (React Native)
- [ ] Study session timer
- [ ] Achievement badges
- [ ] Leaderboard system
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent flashcard generation
- Tailwind CSS for the utility-first styling system
- Framer Motion for smooth animations
- The React and Node.js communities

---

**Built with ❤️ using modern web technologies**

For detailed documentation:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
