import React, { useMemo } from 'react';
import { TRAINING_CATEGORIES } from '../lib/constants';
import { BOOSTERS_BY_CATEGORY } from '../lib/boosters';
import { calculateTotalPoints } from '../lib/pointCosts';

interface TrainingControlsProps {
    allocatedLevels: Record<string, number>;
    onLevelChange: (category: string, delta: number) => void;
    // Config props
    managerBuff: number;
    onManagerChange: (val: number) => void;
    // Stats for manager boost
    manBoost1: string;
    onManBoost1Change: (val: string) => void;
    manBoost2: string;
    onManBoost2Change: (val: string) => void;

    booster: string;
    onBoosterChange: (val: string) => void;
    boosterLevel: number;
    onBoosterLevelChange: (val: number) => void;

    craftedBooster: string;
    onCraftedBoosterChange: (val: string) => void;

    // Points
    availablePoints: number;
    onAvailablePointsChange: (val: number) => void;

    showCategoryList?: boolean; // New prop to control list visibility

    title?: string;
    colorClass?: string;
}

// Flat list of all stats for manager boost dropdown
const ALL_STATS = Array.from(new Set(Object.values(TRAINING_CATEGORIES).flat())).sort();


export default function TrainingControls({
    allocatedLevels,
    onLevelChange,
    managerBuff,
    onManagerChange,
    manBoost1, onManBoost1Change,
    manBoost2, onManBoost2Change,
    booster,
    onBoosterChange,
    boosterLevel,
    onBoosterLevelChange,
    craftedBooster,
    onCraftedBoosterChange,
    availablePoints,
    onAvailablePointsChange,
    showCategoryList = true,
    title = "Training",
    colorClass = "border-blue-500"
}: TrainingControlsProps) {

    const usedPoints = useMemo(() => calculateTotalPoints(allocatedLevels), [allocatedLevels]);
    const remainingPoints = availablePoints - usedPoints;
    const isOverBudget = remainingPoints < 0;

    return (
        <div>
            <h2 className={`text-xl font-bold text-slate-200 mb-4 border-l-4 ${colorClass} pl-3`}>
                {title}
            </h2>

            {/* Points Config */}
            <div className="bg-slate-900/50 p-3 rounded-lg mb-4 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Points</span>
                    <input
                        type="number"
                        value={availablePoints}
                        onChange={(e) => onAvailablePointsChange(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 bg-slate-800 text-white text-sm font-bold py-1 px-2 rounded border border-slate-600 focus:border-blue-500 outline-none text-center"
                    />
                </div>
                <div className={`text-sm font-bold font-mono ${isOverBudget ? 'text-red-500' : 'text-slate-200'}`}>
                    Used: {usedPoints} / {availablePoints}
                </div>
            </div>

            {/* Config Section */}
            <div className="bg-slate-700/30 p-3 rounded-lg mb-4 space-y-4">
                {/* Manager Config */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Manager</span>
                        <select
                            value={managerBuff}
                            onChange={(e) => onManagerChange(Number(e.target.value))}
                            className="bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded border border-slate-600 focus:border-blue-500 outline-none w-32"
                        >
                            <option value={0}>OFF</option>
                            <option value={89}>89 (LBC)</option>
                            <option value={88}>88 (Zeitzler)</option>
                            <option value={87}>87 (Pep)</option>
                            <option value={86}>86</option>
                            <option value={85}>85 (Xabi)</option>
                        </select>
                    </div>
                    {/* Manager Boosts */}
                    {managerBuff > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={manBoost1}
                                onChange={(e) => onManBoost1Change(e.target.value)}
                                className="bg-slate-800 text-slate-200 text-[10px] py-1 px-2 rounded border border-slate-600 outline-none truncate"
                            >
                                <option value="">(None)</option>
                                {ALL_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select
                                value={manBoost2}
                                onChange={(e) => onManBoost2Change(e.target.value)}
                                className="bg-slate-800 text-slate-200 text-[10px] py-1 px-2 rounded border border-slate-600 outline-none truncate"
                            >
                                <option value="">(None)</option>
                                {ALL_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Booster Config */}
                <div className="space-y-2 pt-2 border-t border-slate-600/50">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Booster</span>
                            <span className="text-[10px] text-slate-500">Lv</span>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={booster}
                                onChange={(e) => onBoosterChange(e.target.value)}
                                className="flex-1 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded border border-slate-600 focus:border-blue-500 outline-none"
                            >
                                <option value="NONE">None</option>
                                {Object.entries(BOOSTERS_BY_CATEGORY).map(([category, boosters]) => (
                                    <optgroup key={category} label={category}>
                                        {boosters.map(b => (
                                            <option key={b.name} value={b.name}>{b.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <select
                                value={boosterLevel}
                                onChange={(e) => onBoosterLevelChange(Number(e.target.value))}
                                className="w-16 bg-slate-800 text-white text-xs font-bold py-1.5 px-2 rounded border border-slate-600 focus:border-blue-500 outline-none"
                                disabled={booster === 'NONE'}
                            >
                                {[1, 2, 3, 4, 5].map(v => (
                                    <option key={v} value={v}>+{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Crafting Slot */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Crafting (+1)</span>
                        </div>
                        <select
                            value={craftedBooster}
                            onChange={(e) => onCraftedBoosterChange(e.target.value)}
                            className="w-full bg-slate-800/80 text-cyan-200 text-xs font-bold py-1.5 px-3 rounded border border-slate-600 focus:border-cyan-500 outline-none"
                        >
                            <option value="NONE">None</option>
                            {Object.entries(BOOSTERS_BY_CATEGORY).map(([category, boosters]) => (
                                <optgroup key={category} label={category}>
                                    {boosters.map(b => (
                                        <option key={b.name} value={b.name}>{b.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Category List */}
            {showCategoryList && (
                <div className="space-y-3">
                    {Object.keys(TRAINING_CATEGORIES).map((category) => {
                        const currentLevel = allocatedLevels[category] || 0;
                        // Calculate cost for NEXT level (current -> current + 1)
                        // Formula: Math.floor(current / 4) + 1
                        // e.g. Lv 0->1 (0/4=0 +1 = 1)
                        // e.g. Lv 4->5 (4/4=1 +1 = 2)
                        const nextCost = Math.floor(currentLevel / 4) + 1;
                        const canIncrease = remainingPoints >= nextCost;

                        return (
                            <div key={category} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                                <span className="text-slate-300 font-medium text-sm">{category}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onLevelChange(category, -1)}
                                        className="w-7 h-7 flex items-center justify-center rounded bg-slate-600 hover:bg-slate-500 text-white transition disabled:opacity-50"
                                        disabled={currentLevel <= 0}
                                    >
                                        -
                                    </button>
                                    <span className="w-5 text-center text-white font-mono text-sm">
                                        {currentLevel}
                                    </span>
                                    <button
                                        onClick={() => onLevelChange(category, 1)}
                                        disabled={!canIncrease}
                                        className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
