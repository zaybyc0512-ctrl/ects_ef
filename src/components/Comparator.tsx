'use client';

import React, { useMemo, useState } from 'react';
import { calculateStats } from '../lib/calculator';
import TrainingControls from './TrainingControls';
import { useSimulatorUrl } from '../hooks/useSimulatorUrl';
import PlayerSelector from './PlayerSelector';
import { getPlayerById, DEFAULT_PLAYER_ID } from '../lib/playerData';
import { TRAINING_CATEGORIES } from '../lib/constants';
import DualCategoryControl from './DualCategoryControl';
import { calculateTotalPoints } from '../lib/pointCosts';
import TargetSettingsModal, { TargetStat } from './TargetSettingsModal';
import { solveAllocation } from '../lib/solver';

export default function Comparator() {
    const {
        playerIdA, setPlayerIdA,
        playerIdB, setPlayerIdB,
        targetStats, setTargetStats,

        levelsA, setLevelsA, managerA, setManagerA,
        manBoost1A, setManBoost1A, manBoost2A, setManBoost2A,
        boosterA, setBoosterA, boosterLvA, setBoosterLvA, craftedA, setCraftedA,
        availablePointsA, setAvailablePointsA,

        levelsB, setLevelsB, managerB, setManagerB,
        manBoost1B, setManBoost1B, manBoost2B, setManBoost2B,
        boosterB, setBoosterB, boosterLvB, setBoosterLvB, craftedB, setCraftedB,
        availablePointsB, setAvailablePointsB,

        copyToClipboard
    } = useSimulatorUrl();

    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('Shooting');
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    // Load player data - Independent
    const playerA = useMemo(() => getPlayerById(playerIdA) || getPlayerById(DEFAULT_PLAYER_ID)!, [playerIdA]);
    const playerB = useMemo(() => getPlayerById(playerIdB) || getPlayerById(DEFAULT_PLAYER_ID)!, [playerIdB]);

    // Handle Player Switch Logic
    const handlePlayerChangeA = (newPid: string) => {
        const p = getPlayerById(newPid);
        if (!p) return;
        setPlayerIdA(newPid);
        // Reset A
        setLevelsA({});
        setAvailablePointsA(p.totalPoints);
        setBoosterA(p.fixedBooster || 'NONE');
        // No target reset needed as targets are global logic
    };

    const handlePlayerChangeB = (newPid: string) => {
        const p = getPlayerById(newPid);
        if (!p) return;
        setPlayerIdB(newPid);
        // Reset B
        setLevelsB({});
        setAvailablePointsB(p.totalPoints);
        setBoosterB(p.fixedBooster || 'NONE');
    };


    const handleLevelChange = (
        setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
        category: string,
        delta: number
    ) => {
        setter(prev => {
            const current = prev[category] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [category]: next };
        });
    };

    // Solver Handler - Uses respective player
    const handleAutoAllocate = (isBuildA: boolean) => {
        const result = solveAllocation(
            isBuildA ? playerA : playerB,
            isBuildA ? managerA : managerB,
            isBuildA ? boosterA : boosterB,
            isBuildA ? boosterLvA : boosterLvB,
            isBuildA ? [manBoost1A, manBoost2A].filter(Boolean) : [manBoost1B, manBoost2B].filter(Boolean),
            isBuildA ? craftedA : craftedB,
            targetStats,
            isBuildA ? availablePointsA : availablePointsB
        );

        if (isBuildA) setLevelsA(result);
        else setLevelsB(result);
    };

    const handleResetLevels = (isBuildA: boolean) => {
        if (confirm(`Reset training levels for Build ${isBuildA ? 'A' : 'B'} (${isBuildA ? playerA.name : playerB.name})?`)) {
            if (isBuildA) setLevelsA({});
            else setLevelsB({});
        }
    };

    const handleShare = async () => {
        const success = await copyToClipboard();
        if (success) {
            setShowCopyMessage(true);
            setTimeout(() => setShowCopyMessage(false), 2000);
        }
    };

    const managerBoostStatsA = useMemo(() => [manBoost1A, manBoost2A].filter(Boolean), [manBoost1A, manBoost2A]);
    const managerBoostStatsB = useMemo(() => [manBoost1B, manBoost2B].filter(Boolean), [manBoost1B, manBoost2B]);

    // Calculate using respective players
    const statsA = useMemo(() =>
        calculateStats(playerA.initialStats, levelsA, managerA, boosterA, boosterLvA, managerBoostStatsA, craftedA),
        [playerA, levelsA, managerA, boosterA, boosterLvA, managerBoostStatsA, craftedA]
    );

    const statsB = useMemo(() =>
        calculateStats(playerB.initialStats, levelsB, managerB, boosterB, boosterLvB, managerBoostStatsB, craftedB),
        [playerB, levelsB, managerB, boosterB, boosterLvB, managerBoostStatsB, craftedB]
    );

    const statKeys = Object.keys(statsA);

    const getDiffDisplay = (valA: number, valB: number) => {
        const diff = valA - valB;
        if (diff > 0) return <span className="text-cyan-400 font-bold">+{diff}</span>;
        if (diff < 0) return <span className="text-red-400 font-bold">{diff}</span>;
        return <span className="text-slate-600">-</span>;
    };

    const getStatColor = (value: number) => {
        if (value >= 90) return 'text-cyan-400 font-bold';
        if (value >= 80) return 'text-green-400 font-semibold';
        if (value >= 70) return 'text-green-200';
        return 'text-slate-400';
    };

    const getCategoryForStat = (statName: string): string | undefined => {
        return Object.keys(TRAINING_CATEGORIES).find(cat => TRAINING_CATEGORIES[cat].includes(statName));
    };

    const handleStatClick = (statName: string) => {
        const cat = getCategoryForStat(statName);
        if (cat) setActiveCategory(cat);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-200 pb-40 relative">

            {/* Toast Notification */}
            <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] transition-all duration-500 ease-in-out ${showCopyMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="bg-slate-800/90 backdrop-blur-md border border-slate-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="font-bold">Link Copied to Clipboard!</span>
                </div>
            </div>

            {/* 1. Header & Selector */}
            <div className="mb-4 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700 pb-4">
                    <div>
                        <h1 className="text-2xl font-black text-white">eFootball Build Simulator</h1>
                        <p className="text-slate-400 text-xs mt-1">
                            Compare builds across different players or variations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsTargetModalOpen(true)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 rounded-full font-bold transition flex items-center gap-2"
                        >
                            <span>🎯 Set Targets</span>
                            {Object.keys(targetStats).length > 0 && (
                                <span className="bg-yellow-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {Object.keys(targetStats).length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleShare}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition shadow-lg flex items-center gap-2"
                        >
                            <span>Share Build</span>
                        </button>
                    </div>
                </div>

                {/* Global Player Selector Removed - Now inside Config Areas */}
            </div>

            {/* 2. Config Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* BUILD A */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md relative group/panel">
                    {/* Auto & Reset Buttons */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <button
                            onClick={() => handleAutoAllocate(true)}
                            title="Auto Allocate for Build A"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-1 px-3 rounded shadow-lg flex items-center gap-1 transition"
                        >
                            ⚡ Auto
                        </button>
                        <button
                            onClick={() => handleResetLevels(true)}
                            title="Reset Build A Levels"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold py-1 px-2 rounded shadow-lg transition"
                        >
                            🗑️
                        </button>
                    </div>

                    {/* Player A Selector */}
                    <div className="mb-4 pr-24">
                        <p className="text-xs font-bold text-cyan-400 mb-1">PLAYER A</p>
                        <PlayerSelector selectedPlayerId={playerIdA} onPlayerSelect={handlePlayerChangeA} />
                        <p className="text-xs text-slate-400 mt-1">{playerA.team} | {playerA.position}</p>
                    </div>

                    <hr className="border-slate-700 my-4" />

                    <TrainingControls
                        allocatedLevels={levelsA}
                        onLevelChange={(c, d) => handleLevelChange(setLevelsA, c, d)}
                        managerBuff={managerA} onManagerChange={setManagerA}
                        manBoost1={manBoost1A} onManBoost1Change={setManBoost1A}
                        manBoost2={manBoost2A} onManBoost2Change={setManBoost2A}
                        booster={boosterA} onBoosterChange={setBoosterA}
                        boosterLevel={boosterLvA} onBoosterLevelChange={setBoosterLvA}
                        craftedBooster={craftedA} onCraftedBoosterChange={setCraftedA}
                        availablePoints={availablePointsA} onAvailablePointsChange={setAvailablePointsA}
                        title="Build A Config" colorClass="border-cyan-500" showCategoryList={false}
                    />
                </div>

                {/* BUILD B */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md relative group/panel">
                    {/* Auto & Reset Buttons */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <button
                            onClick={() => handleAutoAllocate(false)}
                            title="Auto Allocate for Build B"
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1 px-3 rounded shadow-lg flex items-center gap-1 transition"
                        >
                            ⚡ Auto
                        </button>
                        <button
                            onClick={() => handleResetLevels(false)}
                            title="Reset Build B Levels"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold py-1 px-2 rounded shadow-lg transition"
                        >
                            🗑️
                        </button>
                    </div>

                    {/* Player B Selector */}
                    <div className="mb-4 pr-24">
                        <p className="text-xs font-bold text-red-400 mb-1">PLAYER B</p>
                        <PlayerSelector selectedPlayerId={playerIdB} onPlayerSelect={handlePlayerChangeB} />
                        <p className="text-xs text-slate-400 mt-1">{playerB.team} | {playerB.position}</p>
                    </div>

                    <hr className="border-slate-700 my-4" />

                    <TrainingControls
                        allocatedLevels={levelsB}
                        onLevelChange={(c, d) => handleLevelChange(setLevelsB, c, d)}
                        managerBuff={managerB} onManagerChange={setManagerB}
                        manBoost1={manBoost1B} onManBoost1Change={setManBoost1B}
                        manBoost2={manBoost2B} onManBoost2Change={setManBoost2B}
                        booster={boosterB} onBoosterChange={setBoosterB}
                        boosterLevel={boosterLvB} onBoosterLevelChange={setBoosterLvB}
                        craftedBooster={craftedB} onCraftedBoosterChange={setCraftedB}
                        availablePoints={availablePointsB} onAvailablePointsChange={setAvailablePointsB}
                        title="Build B Config" colorClass="border-red-500" showCategoryList={false}
                    />
                </div>
            </div>

            {/* 3. Main Stats Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-700 grid grid-cols-4 text-sm font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                    <div className="text-left">Stat</div>
                    <div className="text-center text-cyan-400">{playerA.name}</div>
                    <div className="text-center">Diff</div>
                    <div className="text-center text-red-400">{playerB.name}</div>
                </div>

                <div className="divide-y divide-slate-700/50">
                    {statKeys.map(stat => {
                        const belongsToActive = getCategoryForStat(stat) === activeCategory;
                        const target = targetStats[stat];

                        return (
                            <div
                                key={stat}
                                onClick={() => handleStatClick(stat)}
                                className={`grid grid-cols-4 px-4 py-3 transition-colors cursor-pointer group ${belongsToActive ? 'bg-indigo-900/30 hover:bg-indigo-900/40' : 'hover:bg-slate-700/40'}`}
                            >
                                <div className="text-sm text-slate-300 flex items-center gap-2 overflow-hidden">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${belongsToActive ? 'bg-indigo-400 shadow-lg shadow-indigo-500/50' : 'bg-transparent'}`}></span>
                                    <span className={`truncate ${belongsToActive ? 'text-indigo-200 font-bold' : ''}`}>{stat}</span>

                                    {/* Target Indicator */}
                                    {target && (
                                        <span className="ml-2 flex items-center gap-1 bg-yellow-900/40 border border-yellow-700/50 rounded-full px-2 py-0.5" title={`Target: ${target.value} (Priority ${target.priority})`}>
                                            <span className="text-[10px] text-yellow-500 font-bold">🎯 {target.value}</span>
                                            <span className="text-[10px] bg-yellow-500 text-black w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold font-mono leading-none">
                                                {target.priority}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                <div className={`text-center font-mono ${getStatColor(statsA[stat])} flex items-center justify-center gap-1`}>
                                    {statsA[stat]}
                                    {target && statsA[stat] >= target.value && <span className="text-[10px] text-yellow-500">✓</span>}
                                </div>
                                <div className="text-center font-mono text-sm flex items-center justify-center">{getDiffDisplay(statsA[stat], statsB[stat])}</div>
                                <div className={`text-center font-mono ${getStatColor(statsB[stat])} flex items-center justify-center gap-1`}>
                                    {statsB[stat]}
                                    {target && statsB[stat] >= target.value && <span className="text-[10px] text-yellow-500">✓</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 4. Footer */}
            <DualCategoryControl
                category={activeCategory}
                levelA={levelsA[activeCategory] || 0} onLevelChangeA={(d) => handleLevelChange(setLevelsA, activeCategory, d)} usedPointsA={calculateTotalPoints(levelsA)} availablePointsA={availablePointsA}
                levelB={levelsB[activeCategory] || 0} onLevelChangeB={(d) => handleLevelChange(setLevelsB, activeCategory, d)} usedPointsB={calculateTotalPoints(levelsB)} availablePointsB={availablePointsB}
            />

            <TargetSettingsModal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                stats={statKeys}
                targets={targetStats}
                onTargetsChange={setTargetStats}
            />

        </div>
    );
}
