# Duolingo Flashcards - AI-Powered Learning Platform

A modern, full-stack flashcard application inspired by Duolingo, featuring AI-generated content focused on acronyms and abbreviations. Built with React, Node.js, MongoDB, and Google Gemini AI.

## ✨ Features

- 🤖 **AI-Generated Flashcards**: Powered by Google Gemini AI to create focused acronym-based flashcards
- 🔐 **Google Authentication**: Secure login with Google OAuth 2.0
- 📊 **Progress Tracking**: Real-time progress monitoring with persistent storage
- 📅 **Study Calendar**: Visual calendar showing study activity and streaks
- 🎨 **Duolingo-Inspired UI**: Clean, modern interface with smooth animations
- 📈 **Analytics Dashboard**: Donut charts and statistics for learning insights
- 🗂️ **Deck Management**: Create, study, and delete flashcard decks (max 15 decks)
- 💾 **Persistent Storage**: MongoDB database for user data and progress

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Passport.js for authentication
- Google Gemini AI for content generation
- Express Session for session management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Google Cloud Console project (for OAuth)
- Google Gemini API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/duolingo-flashcards.git
cd duolingo-flashcards
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
DB_NAME=Duolingo

GEMINI_API_KEY=your_gemini_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SESSION_SECRET=your_random_session_secret

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Project Structure

```
duolingo-flashcards/
├── backend/
│   ├── models/
│   │   ├── Deck.js
│   │   └── User.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🔑 Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories for required environment variables.

## 🌐 Deployment

For deployment instructions, see [deployment_guide.md](./deployment_guide.md).

## 📝 Features in Detail

- **Deck Limit**: Maximum 15 decks per user
- **Cards per Deck**: 10 flashcards generated per topic
- **AI Focus**: Strictly generates acronyms and abbreviations
- **Progress Tracking**: Automatic progress saving to database
- **Calendar Integration**: Tracks study dates and streaks
- **Responsive Design**: Works on desktop and mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Duolingo for design inspiration
- Google Gemini AI for content generation
- React and Node.js communities
