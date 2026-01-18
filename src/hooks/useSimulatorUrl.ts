'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { TRAINING_CATEGORIES } from '../lib/constants';
import { DEFAULT_PLAYER_ID } from '../lib/playerData';

// We import TargetStat type but used implicitly in Record<string, {value: number, priority: number}>
import { TargetStat } from '../components/TargetSettingsModal';

const DEBOUNCE_MS = 500;

export function useSimulatorUrl() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- Initializers ---
    const getInitialLevels = (prefix: string) => {
        const levels: Record<string, number> = {};
        Object.keys(TRAINING_CATEGORIES).forEach(cat => {
            const val = searchParams.get(`${prefix}_${cat}`);
            levels[cat] = val ? parseInt(val, 10) : 0;
        });
        return levels;
    };

    const getInitialManager = (prefix: string) => {
        const val = searchParams.get(`${prefix}_man`);
        return val ? parseInt(val, 10) : 0;
    };
    const getInitialManagerBoost = (prefix: string, slot: number) => {
        return searchParams.get(`${prefix}_man_b${slot}`) || '';
    }

    const getInitialBooster = (prefix: string) => searchParams.get(`${prefix}_boost`) || 'NONE';
    const getInitialBoosterLevel = (prefix: string) => {
        const val = searchParams.get(`${prefix}_boost_lv`);
        return val ? parseInt(val, 10) : 1;
    };
    const getInitialCrafted = (prefix: string) => searchParams.get(`${prefix}_craft`) || 'NONE';

    const getInitialPoints = (prefix: string) => {
        const val = searchParams.get(`${prefix}_pp`);
        return val ? parseInt(val, 10) : 80; // Default 80
    };

    const getInitialPlayerId = () => {
        return searchParams.get('pid') || DEFAULT_PLAYER_ID;
    }

    // Target Stats Parsing: tgt=Speed:90:1|Accel:85:2
    const getInitialTargets = () => {
        const raw = searchParams.get('tgt');
        if (!raw) return {};

        const targets: Record<string, TargetStat> = {};
        raw.split('|').forEach(part => {
            const [stat, val, pri] = part.split(':');
            if (stat && val && pri) {
                targets[stat] = { value: parseInt(val, 10), priority: parseInt(pri, 10) };
            }
        });
        return targets;
    };


    // --- State ---
    const [playerId, setPlayerId] = useState(() => getInitialPlayerId());

    // Targets
    const [targetStats, setTargetStats] = useState<Record<string, TargetStat>>(() => getInitialTargets());

    // Build A
    const [levelsA, setLevelsA] = useState(() => getInitialLevels('a'));
    const [managerA, setManagerA] = useState(() => getInitialManager('a'));
    const [manBoost1A, setManBoost1A] = useState(() => getInitialManagerBoost('a', 1));
    const [manBoost2A, setManBoost2A] = useState(() => getInitialManagerBoost('a', 2));
    const [boosterA, setBoosterA] = useState(() => getInitialBooster('a'));
    const [boosterLvA, setBoosterLvA] = useState(() => getInitialBoosterLevel('a'));
    const [craftedA, setCraftedA] = useState(() => getInitialCrafted('a'));
    const [availablePointsA, setAvailablePointsA] = useState(() => getInitialPoints('a'));

    // Build B
    const [levelsB, setLevelsB] = useState(() => getInitialLevels('b'));
    const [managerB, setManagerB] = useState(() => getInitialManager('b'));
    const [manBoost1B, setManBoost1B] = useState(() => getInitialManagerBoost('b', 1));
    const [manBoost2B, setManBoost2B] = useState(() => getInitialManagerBoost('b', 2));
    const [boosterB, setBoosterB] = useState(() => getInitialBooster('b'));
    const [boosterLvB, setBoosterLvB] = useState(() => getInitialBoosterLevel('b'));
    const [craftedB, setCraftedB] = useState(() => getInitialCrafted('b'));
    const [availablePointsB, setAvailablePointsB] = useState(() => getInitialPoints('b'));


    // --- Sync to URL ---
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams();

            params.set('pid', playerId);

            // Serialize Targets
            if (Object.keys(targetStats).length > 0) {
                const tgtStr = Object.entries(targetStats)
                    .map(([stat, t]) => `${stat}:${t.value}:${t.priority}`)
                    .join('|');
                params.set('tgt', tgtStr);
            }

            const appendParams = (
                prefix: string,
                levels: Record<string, number>,
                man: number,
                manB1: string,
                manB2: string,
                boost: string,
                boostLv: number,
                craft: string,
                pp: number
            ) => {
                // Levels
                Object.entries(levels).forEach(([cat, val]) => {
                    if (val > 0) params.set(`${prefix}_${cat}`, val.toString());
                });
                // Manager
                if (man > 0) params.set(`${prefix}_man`, man.toString());
                if (manB1) params.set(`${prefix}_man_b1`, manB1);
                if (manB2) params.set(`${prefix}_man_b2`, manB2);

                // Booster
                if (boost !== 'NONE') {
                    params.set(`${prefix}_boost`, boost);
                    if (boostLv !== 1) params.set(`${prefix}_boost_lv`, boostLv.toString());
                }
                // Crafted
                if (craft !== 'NONE') params.set(`${prefix}_craft`, craft);

                // Points
                params.set(`${prefix}_pp`, pp.toString());
            };

            appendParams('a', levelsA, managerA, manBoost1A, manBoost2A, boosterA, boosterLvA, craftedA, availablePointsA);
            appendParams('b', levelsB, managerB, manBoost1B, manBoost2B, boosterB, boosterLvB, craftedB, availablePointsB);

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });

        }, DEBOUNCE_MS);

        return () => clearTimeout(handler);
    }, [
        playerId, targetStats,
        levelsA, levelsB,
        managerA, managerB, manBoost1A, manBoost2A, manBoost1B, manBoost2B,
        boosterA, boosterB, boosterLvA, boosterLvB,
        craftedA, craftedB,
        availablePointsA, availablePointsB,
        pathname, router
    ]);

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            return true;
        } catch (err) {
            return false;
        }
    }, []);

    return {
        playerId, setPlayerId,
        targetStats, setTargetStats,

        levelsA, setLevelsA,
        managerA, setManagerA,
        manBoost1A, setManBoost1A,
        manBoost2A, setManBoost2A,
        boosterA, setBoosterA,
        boosterLvA, setBoosterLvA,
        craftedA, setCraftedA,
        availablePointsA, setAvailablePointsA,

        levelsB, setLevelsB,
        managerB, setManagerB,
        manBoost1B, setManBoost1B,
        manBoost2B, setManBoost2B,
        boosterB, setBoosterB,
        boosterLvB, setBoosterLvB,
        craftedB, setCraftedB,
        availablePointsB, setAvailablePointsB,

        copyToClipboard
    };
}
