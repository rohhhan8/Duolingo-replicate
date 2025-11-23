import { motion } from 'framer-motion';
import type { Skill } from '../types';

interface ProgressBarProps {
    skill: Skill;
    index: number;
}

export default function ProgressBar({ skill, index }: ProgressBarProps) {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="mb-6"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">{skill.name}</span>
                <span className="text-xs text-slate-500">{skill.progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: skill.color }}
                />
            </div>
        </motion.div>
    );
}
