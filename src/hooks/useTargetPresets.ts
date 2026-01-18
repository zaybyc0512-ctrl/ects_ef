'use client';

import { useState, useEffect } from 'react';
import { TargetStat } from '../components/TargetSettingsModal';

export interface Preset {
    name: string;
    targets: Record<string, TargetStat>;
}

const STORAGE_KEY = 'ef_target_presets';

export function useTargetPresets() {
    const [presets, setPresets] = useState<Preset[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setPresets(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse presets", e);
            }
        }
    }, []);

    const savePreset = (name: string, targets: Record<string, TargetStat>) => {
        if (!name.trim()) return;

        const newPreset: Preset = { name, targets };
        setPresets(prev => {
            // Remove existing with same name to overwrite, or append
            const filtered = prev.filter(p => p.name !== name);
            const updated = [...filtered, newPreset];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const deletePreset = (name: string) => {
        if (confirm(`Delete preset "${name}"?`)) {
            setPresets(prev => {
                const updated = prev.filter(p => p.name !== name);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        }
    };

    return { presets, savePreset, deletePreset };
}
