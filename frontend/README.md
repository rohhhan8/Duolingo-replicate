# Prep.ai Frontend

Modern, AI-powered flashcard generator with stunning UI/UX.

## 🎨 Features

- **Premium Design**: Glassmorphism effects, vibrant gradients, smooth animations
- **Interactive Flashcards**: Click-to-flip cards with 3D rotation effects
- **Smart Caching**: Instant loading for previously generated decks
- **Responsive**: Works beautifully on all devices
- **Real-time Stats**: Track your learning progress
- **Toast Notifications**: User-friendly feedback system

## 🚀 Tech Stack

- **HTML5**: Semantic markup with SEO optimization
- **CSS3**: Modern design with CSS variables, animations, and glassmorphism
- **Vanilla JavaScript**: No frameworks, pure performance
- **Google Fonts**: Inter & Space Grotesk for premium typography

## 📁 File Structure

```
client/
├── index.html      # Main HTML structure
├── styles.css      # Complete design system
├── app.js          # Application logic & API integration
└── README.md       # This file
```

## 🎯 Key Components

### 1. Hero Section
- Eye-catching gradient background with animated shapes
- Topic input with search icon
- Real-time statistics display
- Call-to-action button with hover effects

### 2. Flashcard Display
- 3D flip animation on click
- Difficulty badges (easy, medium, hard)
- Responsive grid layout
- Staggered entrance animations

### 3. My Decks Modal
- View all previously generated decks
- Click to load any deck instantly
- Sorted by newest first
- Smooth modal animations

### 4. Loading States
- Animated spinner
- Progress bar animation
- Topic-specific loading message

## 🎨 Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Accent**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Typography
- **Headings**: Space Grotesk (700)
- **Body**: Inter (400-600)
- **Monospace**: System fonts

### Effects
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradients**: Smooth color transitions
- **Shadows**: Layered depth with glow effects
- **Animations**: Smooth 60fps transitions

## 🔧 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`:

- `POST /api/generate` - Generate or fetch cached deck
- `GET /api/decks` - Retrieve all decks
- `GET /api/health` - Health check

## 📱 Responsive Breakpoints

- **Desktop**: 1400px+ (optimal)
- **Tablet**: 768px - 1399px
- **Mobile**: < 768px

## ✨ Animations

- **fadeIn**: Smooth opacity transition
- **fadeInUp**: Slide up with fade
- **fadeInScale**: Scale up with fade
- **slideUp**: Modal entrance
- **slideInRight**: Toast notifications
- **spin**: Loading spinner
- **float**: Background shapes
- **progress**: Loading bar

## 🎯 User Flow

1. User enters a topic
2. Click "Generate Deck" or press Enter
3. Loading state with animated progress
4. Flashcards appear with staggered animation
5. Click any card to flip and see the answer
6. View all decks via "My Decks" button
7. Click "New Deck" to start over

## 🚀 Performance

- **No external dependencies** (except Google Fonts)
- **Optimized animations** (GPU-accelerated transforms)
- **Lazy loading** for images (if added)
- **Minimal DOM manipulation**
- **Efficient event delegation**

## 🎨 Customization

All design tokens are defined as CSS variables in `:root`:

```css
:root {
    --primary: #6366f1;
    --accent: #ec4899;
    --bg-primary: #0f0f1e;
    /* ... and more */
}
```

Simply modify these values to customize the entire theme!

## 📝 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔮 Future Enhancements

- [ ] Quiz mode with scoring
- [ ] Export decks as PDF
- [ ] Spaced repetition algorithm
- [ ] Dark/Light theme toggle
- [ ] Deck sharing functionality
- [ ] Study session timer
- [ ] Progress tracking charts

---

Built with ❤️ using modern web technologies
