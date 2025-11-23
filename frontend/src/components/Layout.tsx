import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    leftPanel: ReactNode;
    centerPanel: ReactNode;
    rightPanel: ReactNode;
}

export default function Layout({ leftPanel, centerPanel, rightPanel }: LayoutProps) {
    return (
        <div className="h-screen w-screen overflow-hidden flex">
            {/* Left Panel - Progress Tracker */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-[20%] min-w-[250px] border-r border-white/10 bg-slate-950/50 backdrop-blur-xl overflow-y-auto"
            >
                {leftPanel}
            </motion.aside>

            {/* Center Panel - Main Feed */}
            <motion.main
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 overflow-y-auto p-8"
            >
                {centerPanel}
            </motion.main>

            {/* Right Panel - Activity & Gamification */}
            <motion.aside
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-[20%] min-w-[250px] border-l border-white/10 bg-slate-950/50 backdrop-blur-xl overflow-y-auto"
            >
                {rightPanel}
            </motion.aside>
        </div>
    );
}
