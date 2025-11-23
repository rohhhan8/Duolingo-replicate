import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 h-[200px]"
                >
                    <div className="animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-6 bg-slate-700 rounded w-3/4" />
                            <div className="h-10 w-10 bg-slate-700 rounded-lg" />
                        </div>
                        <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
                        <div className="h-8 bg-slate-700 rounded w-1/3 mb-4" />
                        <div className="flex gap-2">
                            <div className="h-6 bg-slate-700 rounded w-16" />
                            <div className="h-6 bg-slate-700 rounded w-16" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
