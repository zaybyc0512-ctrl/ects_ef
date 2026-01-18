import React from 'react';
import GaugeSlider from './GaugeSlider';
import { calculateTotalPoints } from '../lib/pointCosts';

interface DualCategoryControlProps {
    category: string;

    // Build A
    levelA: number;
    onLevelChangeA: (delta: number) => void;
    usedPointsA: number;
    availablePointsA: number;

    // Build B
    levelB: number;
    onLevelChangeB: (delta: number) => void;
    usedPointsB: number;
    availablePointsB: number;
}

export default function DualCategoryControl({
    category,
    levelA, onLevelChangeA, usedPointsA, availablePointsA,
    levelB, onLevelChangeB, usedPointsB, availablePointsB
}: DualCategoryControlProps) {

    const nextCostA = Math.floor(levelA / 4) + 1;
    const canIncreaseA = (availablePointsA - usedPointsA) >= nextCostA;

    const nextCostB = Math.floor(levelB / 4) + 1;
    const canIncreaseB = (availablePointsB - usedPointsB) >= nextCostB;

    // Helpers to calculate strict max level affordable
    // This is expensive to do exactly right in real-time if we iterate.
    // Instead, we just wrap the onChange to ensure we don't exceed budget.

    const handleSliderChange = (
        currentLevel: number,
        targetLevel: number,
        onDelta: (d: number) => void,
        available: number,
        used: number
    ) => {
        // If target > current, check if we can afford the jump
        if (targetLevel > currentLevel) {
            // Calculate cost of jump
            // Ideally we calculate cost for (current+1)...target
            // We can do this by using our cost formula logic.
            let costNeeded = 0;
            for (let l = currentLevel + 1; l <= targetLevel; l++) {
                costNeeded += Math.floor((l - 1) / 4) + 1;
            }

            if ((available - used) >= costNeeded) {
                onDelta(targetLevel - currentLevel);
            } else {
                // Can't afford full jump. Try to find max affordable?
                // For simplicity, just don't move. Or move 1 if possible.
                // Let's just block for now for safety.
            }
        } else if (targetLevel < currentLevel) {
            // Decreasing is always allowed
            onDelta(targetLevel - currentLevel);
        }
    };


    return (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 border-t border-slate-700 backdrop-blur-sm p-4 shadow-xl z-50">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                    Active Training: <span className="text-white">{category}</span>
                </h3>

                <div className="flex w-full items-center justify-between gap-6">

                    {/* Build A Controls */}
                    <div className="flex-1 flex items-center justify-end gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-cyan-400 font-bold text-sm mr-auto font-mono">Build A</span>

                        <button
                            onClick={() => onLevelChangeA(-1)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-white transition disabled:opacity-50 text-lg footer-btn"
                            disabled={levelA <= 0}
                        >
                            -
                        </button>

                        <div className="flex-1 mx-2">
                            <GaugeSlider
                                value={levelA}
                                onChange={(val) => handleSliderChange(levelA, val, onLevelChangeA, availablePointsA, usedPointsA)}
                                colorHex="#22d3ee" // Cyan
                            />
                        </div>

                        <span className="w-6 text-center text-white font-mono text-xl font-bold">
                            {levelA}
                        </span>
                        <button
                            onClick={() => onLevelChangeA(1)}
                            disabled={!canIncreaseA}
                            className="w-8 h-8 flex items-center justify-center rounded bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-lg shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed text-lg footer-btn"
                        >
                            +
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-10 w-px bg-slate-700 hidden md:block"></div>

                    {/* Build B Controls */}
                    <div className="flex-1 flex items-center justify-start gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <button
                            onClick={() => onLevelChangeB(-1)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-white transition disabled:opacity-50 text-lg footer-btn"
                            disabled={levelB <= 0}
                        >
                            -
                        </button>
                        <span className="w-6 text-center text-white font-mono text-xl font-bold">
                            {levelB}
                        </span>
                        <div className="flex-1 mx-2">
                            <GaugeSlider
                                value={levelB}
                                onChange={(val) => handleSliderChange(levelB, val, onLevelChangeB, availablePointsB, usedPointsB)}
                                colorHex="#f87171" // Red
                            />
                        </div>
                        <button
                            onClick={() => onLevelChangeB(1)}
                            disabled={!canIncreaseB}
                            className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed text-lg footer-btn"
                        >
                            +
                        </button>
                        <span className="text-red-400 font-bold text-sm ml-auto font-mono">Build B</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
