import { motion } from 'framer-motion';

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    size?: number;
    strokeWidth?: number;
}

export default function DonutChart({ data, size = 160, strokeWidth = 20 }: DonutChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    if (total === 0) {
        return (
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                </svg>
                <div className="absolute text-gray-400 text-sm font-medium">No Data</div>
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {data.map((item, index) => {
                    const percentage = item.value / total;
                    const dashArray = percentage * circumference;
                    const angle = currentAngle;
                    currentAngle += percentage * 360;

                    return (
                        <motion.circle
                            key={item.label}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={0}
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{ strokeDasharray: `${dashArray} ${circumference}` }}
                            transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                            style={{
                                transformOrigin: 'center',
                                transform: `rotate(${angle}deg)`,
                            }}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                    );
                })}
            </svg>
            {/* Center Text */}
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-900">{total}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Decks</span>
            </div>
        </div>
    );
}
