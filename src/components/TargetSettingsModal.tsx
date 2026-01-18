import React, { useState } from 'react';
import GaugeSlider from './GaugeSlider';
import { useTargetPresets } from '../hooks/useTargetPresets';

export interface TargetStat {
    value: number;
    priority: number;
}

interface TargetSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: string[];
    targets: Record<string, TargetStat>;
    onTargetsChange: (newTargets: Record<string, TargetStat>) => void;
}

export default function TargetSettingsModal({
    isOpen,
    onClose,
    stats,
    targets,
    onTargetsChange
}: TargetSettingsModalProps) {

    // Local state for preset name input
    const [presetName, setPresetName] = useState('');
    const { presets, savePreset, deletePreset } = useTargetPresets();

    if (!isOpen) return null;

    const handleValueChange = (stat: string, val: number) => {
        const newTargets = { ...targets };

        if (isNaN(val) || val <= 0) {
            // DELETE
            if (newTargets[stat]) {
                const removedPriority = newTargets[stat].priority;
                delete newTargets[stat];
                // Shift priorities down
                Object.keys(newTargets).forEach(key => {
                    if (newTargets[key].priority > removedPriority) {
                        newTargets[key] = { ...newTargets[key], priority: newTargets[key].priority - 1 };
                    }
                });
            }
        } else {
            // UPDATE or ADD
            if (newTargets[stat]) {
                // Just update value
                newTargets[stat] = { ...newTargets[stat], value: val };
            } else {
                // Add new with next priority
                const nextPriority = Object.keys(newTargets).length + 1;
                newTargets[stat] = { value: val, priority: nextPriority };
            }
        }

        onTargetsChange(newTargets);
    };

    const handleSavePreset = () => {
        if (!presetName) return;
        savePreset(presetName, targets);
        setPresetName(''); // Clear input
    };

    const handleLoadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        if (!name) return;
        const found = presets.find(p => p.name === name);
        if (found) {
            onTargetsChange(found.targets);
        }
        // Reset select to default
        e.target.value = '';
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-xl border border-slate-700 shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>🎯</span> Set Target Stats
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (confirm('Clear all targets?')) {
                                    onTargetsChange({});
                                }
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold py-1 px-2 rounded transition"
                            title="Clear All Targets"
                        >
                            🗑️ Reset
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                </div>

                {/* Presets Control Area */}
                <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex flex-col gap-3">
                    {/* Load */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-12">LOAD:</span>
                        <div className="flex-1 relative">
                            <select
                                className="w-full bg-slate-700 text-white text-sm rounded px-2 py-1 appearance-none border border-slate-600 focus:border-cyan-500 focus:outline-none"
                                onChange={handleLoadPreset}
                                defaultValue=""
                            >
                                <option value="" disabled>Select a Preset...</option>
                                {presets.length === 0 && <option value="" disabled>No saved presets</option>}
                                {presets.map(p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Optional: Delete button next to select? Or just rely on list management later. 
                    For now, let's keep it simple: Load only from select.
                    To delete, maybe we need a small list or 'Manage' mode, but user asked for simple delete next to select.
                    Since we can't easily select-to-delete in a standard dropdown without loading it first, 
                    let's add a list of saved items below ONLY if we want complex UI.
                    
                    Re-reading request: "Select... and next to it a delete button."
                    It's hard to know WHICH to delete if we just have a select. 
                    Let's implement a small "Saved Presets" list instead of just a dropdown, OR a dropdown that immediately loads, 
                    and maybe a separate small section for deleting?
                    
                    Actually, let's stick to the prompt: "Load Preset" dropdown.
                    "Select... loads it". 
                    "Delete button next to it". 
                    This implies we select, THEN delete? Or delete the CURRENTLY selected one?
                    Dropdown usually resets after selection (as implemented above).
                    
                    Let's try a better layout:
                    Row 1: Save Current [ Input ] [ Save ]
                    Row 2: Load [ Select Preset ] (Choosing one loads it) 
                           [ List of presets with delete buttons? ]
                           
                    Refined Plan:
                    Two columns in this control area.
                    Left: Save
                    Right: List/Load
                 */}
                    </div>

                    {/* Better Preset UI: Split View */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Save Side */}
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Preset Name (e.g. Meta FW)"
                                className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                            />
                            <button
                                onClick={handleSavePreset}
                                disabled={!presetName}
                                className="bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Preset List Chips */}
                    {presets.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {presets.map(p => (
                                <div key={p.name} className="flex items-center gap-1 bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded-full border border-slate-600">
                                    <span
                                        className="cursor-pointer hover:text-white font-bold"
                                        onClick={() => onTargetsChange(p.targets)}
                                        title="Click to Load"
                                    >
                                        {p.name}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deletePreset(p.name); }}
                                        className="text-slate-400 hover:text-red-400 ml-1 font-bold px-1"
                                        title="Delete Preset"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Content - Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-3">
                        {stats.map(stat => {
                            const target = targets[stat];
                            const val = target?.value || 0;

                            return (
                                <div key={stat} className="flex flex-col gap-1 py-2 border-b border-slate-800/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                            {stat}
                                            {target && (
                                                <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full">
                                                    {target.priority}
                                                </span>
                                            )}
                                        </span>
                                        <input
                                            type="number"
                                            min="0" max="99"
                                            value={val > 0 ? val : ''}
                                            placeholder="-"
                                            onChange={(e) => handleValueChange(stat, parseInt(e.target.value, 10))}
                                            className={`w-14 bg-slate-800 border ${target ? 'border-yellow-500 text-yellow-500' : 'border-slate-700 text-slate-400'} rounded px-2 py-1 text-right font-bold text-sm focus:outline-none focus:border-yellow-400`}
                                        />
                                    </div>

                                    {/* Slider */}
                                    <div className="px-2">
                                        <GaugeSlider
                                            value={val}
                                            max={99}
                                            onChange={(newVal) => handleValueChange(stat, newVal)}
                                            colorHex="#eab308" // Yellow-500
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
