'use client';

import React, { useState, useMemo } from 'react';
import { samplePlayer } from '../lib/sampleData';
import { TRAINING_CATEGORIES } from '../lib/constants';
import { calculateStats } from '../lib/calculator';

export default function Simulator() {
    // State for allocated training levels
    const [allocatedLevels, setAllocatedLevels] = useState<Record<string, number>>(
        Object.keys(TRAINING_CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
    );

    // Derived state: Current stats based on allocation
    const currentStats = useMemo(() => {
        return calculateStats(
            samplePlayer.baseStats,
            allocatedLevels,
            0, // Manager buff (fixed at 0 for now, can be state later)
            samplePlayer.booster
        );
    }, [allocatedLevels]);

    const handleLevelChange = (category: string, delta: number) => {
        setAllocatedLevels(prev => {
            const current = prev[category] || 0;
            const next = Math.max(0, current + delta); // Prevent negative levels
            return { ...prev, [category]: next };
        });
    };

    // Helper to determine stat color class
    const getStatColor = (value: number) => {
        if (value >= 90) return 'text-cyan-400 font-bold'; // Top tier
        if (value >= 80) return 'text-green-400 font-semibold'; // Good
        if (value >= 70) return 'text-yellow-100'; // Decent
        return 'text-gray-400'; // Average/Low
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
            {/* Header */}
            <div className="mb-8 border-b border-slate-600 pb-4">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
                    {samplePlayer.names.en}
                </h1>
                {samplePlayer.names.jp && (
                    <p className="text-slate-400 text-sm mt-1">{samplePlayer.names.jp}</p>
                )}
                <div className="mt-2 flex gap-3 text-sm">
                    <span className="px-2 py-1 bg-slate-700 rounded text-cyan-300">
                        {samplePlayer.data.position}
                    </span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-slate-300">
                        {samplePlayer.data.playStyle}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column: Training Controls */}
                <div>
                    <h2 className="text-xl font-bold text-slate-200 mb-4 border-l-4 border-blue-500 pl-3">
                        Training
                    </h2>
                    <div className="space-y-3">
                        {Object.keys(TRAINING_CATEGORIES).map((category) => (
                            <div key={category} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                                <span className="text-slate-300 font-medium text-sm">{category}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleLevelChange(category, -1)}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-slate-600 hover:bg-slate-500 text-white transition disabled:opacity-50"
                                        disabled={allocatedLevels[category] <= 0}
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center text-white font-mono">
                                        {allocatedLevels[category]}
                                    </span>
                                    <button
                                        onClick={() => handleLevelChange(category, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-900/20"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Player Stats */}
                <div>
                    <h2 className="text-xl font-bold text-slate-200 mb-4 border-l-4 border-green-500 pl-3">
                        Stats
                    </h2>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-1">
                        {Object.entries(currentStats).map(([statName, value]) => (
                            <div key={statName} className="flex items-center justify-between py-1 border-b border-slate-700/50 last:border-0">
                                <span className="text-slate-400 text-sm">{statName}</span>
                                <span className={`text-lg font-mono ${getStatColor(value)}`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
