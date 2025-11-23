import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { BookOpen, Sparkles, Search, Zap, LayoutDashboard, Target, TrendingUp, Calendar as CalendarIcon, Flame, Trash2 } from 'lucide-react';
import QuizModal from './components/QuizModal';
import DonutChart from './components/DonutChart';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { deckService } from './services/api';
import type { Deck } from './types';

function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(7);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'decks'>('landing');
  const [activityPage, setActivityPage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const decksPageRef = useRef<HTMLDivElement>(null);

  // Mock streak data for last 5 days
  const [streakDays] = useState([
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: false },
    { day: 'Fri', completed: true },
  ]);

  useEffect(() => {
    loadDecks();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/current_user`, {
        credentials: 'include' // Important: send cookies with request
      });
      const userData = await response.json();
      if (userData && userData._id) { // Check if user has an _id (valid user object)
        setUser(userData);
        setCurrentView('dashboard'); // Auto-switch to dashboard
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const loadDecks = async () => {
    try {
      const response = await deckService.getAllDecks();
      if (response.success && response.data) {
        setDecks(response.data);
      }
    } catch (error) {
      console.error('Failed to load decks:', error);
    }
  };

  const handleGenerateDeck = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsLoading(true);
    try {
      // Send only the topic, not the full prompt
      const response = await deckService.generateDeck({
        topic: topic.trim() // Just the topic name
      });

      if (response.success && response.data) {
        const newDeck = response.data;

        if (response.source === 'cache') {
          toast.success(`Loaded existing deck for "${topic}"`);
        } else {
          toast.success(`Generated 10 flashcards for "${topic}"`);
          setStreak(streak + 1);
        }

        setDecks((prev) => {
          const exists = prev.find((d) => d._id === newDeck._id);
          return exists ? prev : [newDeck, ...prev];
        });

        setTopic('');
        setCurrentView('decks');

        // Ultra smooth scroll to decks page with slight delay for render
        setTimeout(() => {
          decksPageRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }, 100);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate deck');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = async (deckId: string, progress: number) => {
    // Optimistic update
    setDecks(prev => prev.map(d => d._id === deckId ? { ...d, progress } : d));

    try {
      await deckService.updateDeckProgress(deckId, progress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleDeleteDeck = async (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation(); // Prevent opening the deck
    if (!window.confirm('Are you sure you want to delete this deck?')) return;

    try {
      const response = await deckService.deleteDeck(deckId);
      if (response.success) {
        setDecks(prev => prev.filter(d => d._id !== deckId));
        toast.success('Deck deleted successfully');
        // Adjust page if needed
        if (activityPage > 0 && decks.length <= (activityPage * 5) + 1) {
          setActivityPage(activityPage - 1);
        }
      }
    } catch (error) {
      toast.error('Failed to delete deck');
    }
  };

  // Calculate stats
  const totalDecks = decks.length;
  const completedDecks = decks.filter(d => (d.progress || 0) >= 100).length;
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const averageProgress = totalDecks > 0
    ? Math.round(decks.reduce((sum, deck) => sum + (deck.progress || 0), 0) / totalDecks)
    : 0;

  return (
    <>
      <div className="bg-white">
        {/* Minimal Embedded Header with Navigation */}
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo - Clickable */}
              <button
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/logo.png"
                  alt="Duolingo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-bold text-[#58CC02] tracking-tight">duolingo</span>
              </button>

              {/* Navigation - White Capsule */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-2 shadow-sm">
                <button
                  onClick={() => setCurrentView('landing')}
                  className={`px-5 py-2 font-medium transition-all rounded-full flex items-center gap-2 ${currentView === 'landing'
                    ? 'bg-[#58CC02] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#58CC02] hover:bg-green-50'
                    }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-5 py-2 font-medium transition-all rounded-full flex items-center gap-2 ${currentView === 'dashboard'
                    ? 'bg-[#58CC02] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#58CC02] hover:bg-green-50'
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setCurrentView('decks');
                    setTimeout(() => {
                      decksPageRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                      });
                    }, 100);
                  }}
                  className={`px-5 py-2 font-medium transition-all rounded-full flex items-center gap-2 ${currentView === 'decks'
                    ? 'bg-[#58CC02] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#58CC02] hover:bg-green-50'
                    }`}
                >
                  <Zap className="w-4 h-4" />
                  My Decks
                </button>
              </div>


              {/* User Profile / Login */}
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    {/* Custom Avatar with Initials */}
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-white font-bold text-sm">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <a
                      href={`${API_URL}/api/logout`}
                      className="px-5 py-2.5 bg-[#58CC02] border-b-4 border-[#46a302] text-white font-bold rounded-xl hover:bg-[#46a302] hover:border-[#3a8a02] transition-all active:border-b-0 active:translate-y-1"
                    >
                      Logout
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <a
                      href={`${API_URL}/auth/google`}
                      className="text-sm font-bold text-[#58CC02] hover:text-[#46a302] uppercase tracking-wide transition-colors"
                    >
                      Login
                    </a>
                    <a
                      href={`${API_URL}/auth/google`}
                      className="px-5 py-2.5 bg-[#58CC02] border-b-4 border-[#46a302] text-white font-bold rounded-xl hover:bg-[#46a302] hover:border-[#3a8a02] transition-all active:border-b-0 active:translate-y-1"
                    >
                      Get Started
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 1: Landing Page */}
        {
          currentView === 'landing' && (
            <section className="min-h-screen flex items-center justify-center bg-white">
              <div className="max-w-4xl mx-auto px-6 text-center w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-7xl font-black text-gray-900 mb-6 leading-tight">
                    Learn anything,
                    <br />
                    <span className="text-[#58CC02]">
                      master everything
                    </span>
                  </h1>
                  <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    AI-powered flashcards for acronyms and full forms. Study smarter, not harder.
                  </p>

                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerateDeck()}
                        placeholder="Enter topic to learn acronyms (e.g., Medical Terms, Tech Abbreviations)"
                        className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 transition-all shadow-soft hover:shadow-medium bg-white"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      onClick={handleGenerateDeck}
                      disabled={isLoading}
                      className="mt-4 px-8 py-4 bg-[#58CC02] hover:bg-[#46a302] text-white text-lg font-bold rounded-2xl transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-[0_4px_0_#46a302] active:shadow-none active:translate-y-1"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating 10 Cards...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate 10 Flashcards
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>
          )
        }

        {/* SECTION 2: Dashboard - Bento Style */}
        {
          currentView === 'dashboard' && (
            <section className="min-h-screen bg-white pt-24 pb-12">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-5xl font-black text-gray-900 mb-8">Dashboard</h2>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                  {/* LEFT SIDE - Stats Cards */}
                  <div className="col-span-3 space-y-6">
                    {/* Completed Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#58CC02] rounded-2xl flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Completed</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-black text-gray-900">{completedDecks}</div>
                        <div className="text-sm text-gray-500 font-medium">/ {totalDecks}</div>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm">decks fully mastered ({averageProgress}% avg)</p>
                    </motion.div>

                    {/* Total Decks */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#58CC02] rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Total Decks</h3>
                      </div>
                      <div className="text-4xl font-black text-gray-900">{totalDecks}</div>
                      <p className="text-gray-600 mt-2 text-sm">{totalCards} total cards</p>
                    </motion.div>

                    {/* Study Hours */}


                    {/* Category Breakdown - Donut Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200 flex flex-col items-center justify-center"
                    >
                      <div className="flex items-center gap-2 mb-4 w-full">
                        <div className="w-8 h-8 bg-[#58CC02] rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Topics</h3>
                      </div>
                      <DonutChart
                        data={[
                          { label: 'Tech', value: decks.length > 0 ? Math.ceil(decks.length * 0.6) : 0, color: '#58CC02' }, // Mock distribution
                          { label: 'Science', value: decks.length > 0 ? Math.floor(decks.length * 0.4) : 0, color: '#FFC800' }
                        ]}
                        size={140}
                      />
                    </motion.div>
                  </div>

                  {/* CENTER - Recent Activity */}
                  <div className="col-span-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-50 rounded-3xl p-8 border border-gray-100 h-full"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                        {/* Pagination Controls */}
                        {decks.length > 5 && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActivityPage(Math.max(0, activityPage - 1))}
                              disabled={activityPage === 0}
                              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-600">
                              {activityPage + 1} / {Math.ceil(decks.length / 5)}
                            </span>
                            <button
                              onClick={() => setActivityPage(Math.min(Math.ceil(decks.length / 5) - 1, activityPage + 1))}
                              disabled={activityPage >= Math.ceil(decks.length / 5) - 1}
                              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {decks.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500">No decks yet. Create your first deck!</p>
                          </div>
                        ) : (
                          decks.slice(activityPage * 5, (activityPage + 1) * 5).map((deck, index) => {
                            const completion = deck.progress || 0;
                            return (
                              <div
                                key={deck._id}
                                className="bg-[#58CC02] rounded-2xl p-6 border-b-4 border-[#46a302] hover:border-[#3a8a02] transition-all cursor-pointer min-h-[120px] active:border-b-0 active:translate-y-1"
                                onClick={() => setSelectedDeck(deck)}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex-1 pr-4">
                                    <h4 className="text-lg font-bold text-white mb-2">{deck.topic}</h4>
                                    <p className="text-sm text-green-100">{deck.cards.length} cards • {new Date(deck.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-3xl font-black text-white">{completion}%</div>
                                    <div className="text-xs text-green-100 font-bold uppercase">Mastered</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {/* Progress Bar */}
                                  <div className="flex-1 bg-black/20 rounded-full h-3">
                                    <div
                                      className="bg-white h-3 rounded-full transition-all"
                                      style={{ width: `${completion}%` }}
                                    />
                                  </div>
                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => handleDeleteDeck(e, deck._id)}
                                    className="p-2 text-green-200 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Delete Deck"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* RIGHT SIDE - Streak & Calendar */}
                  <div className="col-span-3 space-y-6">
                    {/* Streak - Duolingo Green */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#58CC02] rounded-2xl flex items-center justify-center">
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Streak</h3>
                          <p className="text-xs text-green-700 font-semibold">{streak} days</p>
                        </div>
                      </div>

                      {/* Last 5 Days - Compact */}
                      <div className="flex justify-between gap-2">
                        {streakDays.map((day, index) => (
                          <div key={index} className="text-center flex-1">
                            <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                            <div
                              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${day.completed
                                ? 'bg-[#58CC02] text-white shadow-md'
                                : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                              {day.completed ? <Flame className="w-4 h-4" /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Full Calendar - Functional */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-3xl p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Day Headers */}
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                          <div key={i} className="text-center text-xs font-semibold text-gray-500 py-2">
                            {day}
                          </div>
                        ))}

                        {/* Calendar Days */}
                        {(() => {
                          const today = new Date();
                          const currentMonth = today.getMonth();
                          const currentYear = today.getFullYear();
                          const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

                          // Get study dates from decks
                          const studyDates = new Set(
                            decks.map(deck => new Date(deck.createdAt).toDateString())
                          );

                          const days = [];

                          // Empty cells for days before month starts
                          for (let i = 0; i < firstDay; i++) {
                            days.push(<div key={`empty-${i}`} className="aspect-square" />);
                          }

                          // Actual days of the month
                          for (let day = 1; day <= daysInMonth; day++) {
                            const date = new Date(currentYear, currentMonth, day);
                            const isToday = date.toDateString() === today.toDateString();
                            const hasActivity = studyDates.has(date.toDateString());

                            days.push(
                              <div
                                key={day}
                                className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all cursor-pointer ${isToday
                                  ? 'bg-[#58CC02] text-white font-bold shadow-md'
                                  : hasActivity
                                    ? 'bg-green-100 text-green-700 font-semibold hover:bg-green-200'
                                    : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                              >
                                {day}
                              </div>
                            );
                          }

                          return days;
                        })()}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-3 h-3 bg-[#58CC02] rounded"></div>
                          <span>Study day</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>
          )
        }

        {/* SECTION 3: Decks Page - Redesigned */}
        {
          (currentView === 'decks' || decks.length > 0) && (
            <section
              ref={decksPageRef}
              className="min-h-screen bg-white pt-24 pb-12"
            >
              <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                  <h2 className="text-5xl font-black text-gray-900 mb-3">Your Decks</h2>
                  <p className="text-xl text-gray-600">Click any deck to start studying acronyms</p>
                </div>

                {/* Decks Grid - 3x3 Grid */}
                {decks.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No decks yet</h3>
                    <p className="text-gray-600 text-lg">Generate your first deck to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map((deck, index) => (
                      <motion.div
                        key={deck._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedDeck(deck)}
                        className="bg-[#58CC02] rounded-3xl p-8 cursor-pointer hover-lift shadow-lg border-b-4 border-[#46a302] hover:border-[#3a8a02] active:border-b-0 active:translate-y-1 group relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between mb-6 relative z-10">
                          <div className="flex-1 pr-4 min-w-0">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight break-words line-clamp-2">
                              {deck.topic}
                            </h3>
                            <p className="text-green-50 text-lg font-medium">{deck.cards.length} flashcards</p>
                          </div>
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm relative z-10">
                          <div className="text-white/90 text-sm mb-2">Created on</div>
                          <div className="text-white font-bold">{new Date(deck.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )
        }

        {/* Footer */}
        <footer className="border-t border-gray-100 py-6 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            Powered by Google Gemini AI • Duolingo Clone
          </div>
        </footer>
      </div >

      <QuizModal
        deck={selectedDeck}
        onClose={() => setSelectedDeck(null)}
        onUpdateProgress={handleProgressUpdate}
      />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
