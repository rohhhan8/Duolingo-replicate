import { motion } from 'framer-motion';
import { Layers, Calendar } from 'lucide-react';
import type { Deck } from '../types';

interface DeckCardProps {
    deck: Deck;
    onClick: () => void;
    index: number;
}

export default function DeckCard({ deck, onClick, index }: DeckCardProps) {
    const difficultyColors = {
        easy: 'bg-green-500/20 text-green-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
        hard: 'bg-red-500/20 text-red-400',
    };

    const getDifficultyCount = (difficulty: 'easy' | 'medium' | 'hard') => {
        return deck.cards.filter((card) => card.difficulty === difficulty).length;
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: index * 0.05,
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={onClick}
            className="glass glass-hover rounded-2xl p-6 cursor-pointer group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:gradient-text transition-all">
                        {deck.topic}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(deck.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="glass rounded-lg p-2">
                    <Layers className="w-5 h-5 text-primary-400" />
                </div>
            </div>

            {/* Card Count */}
            <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-bold gradient-text">{deck.cards.length}</div>
                <div className="text-sm text-slate-400">flashcards</div>
            </div>

            {/* Difficulty Distribution */}
            <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
                    const count = getDifficultyCount(difficulty);
                    if (count === 0) return null;
                    return (
                        <div
                            key={difficulty}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyColors[difficulty]}`}
                        >
                            {count} {difficulty}
                        </div>
                    );
                })}
            </div>

            {/* Hover Effect Gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300 pointer-events-none" />
        </motion.div>
    );
}
