import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Deck, Card } from '../types';

interface QuizModalProps {
    deck: Deck | null;
    onClose: () => void;
    onUpdateProgress?: (deckId: string, progress: number) => void;
}

export default function QuizModal({ deck, onClose, onUpdateProgress }: QuizModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [results, setResults] = useState<{ [key: number]: 'correct' | 'incorrect' }>({});

    if (!deck) return null;

    const currentCard: Card = deck.cards[currentIndex];
    const progress = ((currentIndex + 1) / deck.cards.length) * 100;

    const handleClose = () => {
        if (deck && onUpdateProgress) {
            const answeredCount = Object.keys(results).length;
            const newProgress = Math.round((answeredCount / deck.cards.length) * 100);
            onUpdateProgress(deck._id, newProgress);
        }
        onClose();
    };

    const handleAnswer = (isCorrect: boolean) => {
        setResults({ ...results, [currentIndex]: isCorrect ? 'correct' : 'incorrect' });

        setTimeout(() => {
            if (currentIndex < deck.cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
            }
        }, 600);
    };

    const goToNext = () => {
        if (currentIndex < deck.cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const correctCount = Object.values(results).filter((r) => r === 'correct').length;
    const incorrectCount = Object.values(results).filter((r) => r === 'incorrect').length;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{deck.topic}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Card {currentIndex + 1} of {deck.cards.length}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-gray-700 font-medium">Correct: {correctCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm text-gray-700 font-medium">Incorrect: {incorrectCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Flashcard */}
                    <div className="p-8 min-h-[400px] flex items-center justify-center bg-gray-50">
                        <div
                            className="w-full h-[350px] cursor-pointer perspective-1000"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <motion.div
                                className="relative w-full h-full"
                                initial={false}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front - Question */}
                                <div
                                    className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-green-200 shadow-medium"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-semibold">Question</div>
                                    <p className="text-2xl font-semibold leading-relaxed text-gray-900">{currentCard.question}</p>
                                    <div className="mt-6 text-sm text-gray-500">Click to reveal answer</div>

                                    <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${currentCard.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                        currentCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {currentCard.difficulty.toUpperCase()}
                                    </div>
                                </div>

                                {/* Back - Answer */}
                                <div
                                    className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-blue-200 shadow-medium"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                    }}
                                >
                                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-semibold">Answer</div>
                                    <p className="text-2xl font-semibold leading-relaxed text-gray-900">{currentCard.answer}</p>
                                    <div className="mt-6 text-sm text-gray-500">Click to flip back</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white border-t border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            {/* Navigation */}
                            <div className="flex gap-2">
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentIndex === 0}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-gray-700 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <button
                                    onClick={goToNext}
                                    disabled={currentIndex === deck.cards.length - 1}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-gray-700 transition-colors"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Answer Buttons */}
                            {isFlipped && !results[currentIndex] && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-bold flex items-center gap-2 transition-all hover-lift"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Forgot
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="px-6 py-3 rounded-xl bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700 font-bold flex items-center gap-2 transition-all hover-lift"
                                    >
                                        <Check className="w-5 h-5" />
                                        Got it
                                    </button>
                                </motion.div>
                            )}

                            {/* Result Indicator */}
                            {results[currentIndex] && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`px-4 py-2 rounded-xl font-bold ${results[currentIndex] === 'correct'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {results[currentIndex] === 'correct' ? '✓ Correct' : '✗ Incorrect'}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
