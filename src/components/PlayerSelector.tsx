import React from 'react';
import { PLAYERS, PlayerDef } from '../lib/playerData';

interface PlayerSelectorProps {
    selectedPlayerId: string;
    onPlayerSelect: (playerId: string) => void;
}

export default function PlayerSelector({ selectedPlayerId, onPlayerSelect }: PlayerSelectorProps) {
    return (
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-4 shadow-lg">
            <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Select Player
                </label>
                <select
                    value={selectedPlayerId}
                    onChange={(e) => onPlayerSelect(e.target.value)}
                    className="w-full bg-slate-900 text-white font-bold py-2 px-3 rounded border border-slate-600 focus:border-indigo-500 outline-none"
                >
                    {PLAYERS.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} ({p.team}) - {p.position}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
