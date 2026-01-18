import { TRAINING_CATEGORIES } from './constants';
import { BOOSTER_MAP } from './boosters';

// Manager Proficiency Thresholds
const MANAGER_THRESHOLDS: Record<number, { threshold: number, bonus: number }[]> = {
    89: [{ threshold: 84, bonus: 3 }, { threshold: 56, bonus: 2 }, { threshold: 40, bonus: 1 }],
    88: [{ threshold: 85, bonus: 3 }, { threshold: 57, bonus: 2 }, { threshold: 40, bonus: 1 }],
    87: [{ threshold: 88, bonus: 3 }, { threshold: 59, bonus: 2 }, { threshold: 40, bonus: 1 }],
    86: [{ threshold: 89, bonus: 3 }, { threshold: 60, bonus: 2 }, { threshold: 40, bonus: 1 }],
    85: [{ threshold: 93, bonus: 3 }, { threshold: 62, bonus: 2 }, { threshold: 40, bonus: 1 }],
};

export function calculateStats(
    baseStats: Record<string, number>,
    allocatedLevels: Record<string, number>,
    managerProficiency: number,
    activeBoosterName: string = 'NONE',
    boosterLevel: number = 1,
    // New Params
    managerBoostStats: string[] = [], // List of stats getting +1 from manager
    craftedBoosterName: string = 'NONE' // Crafting slot booster (always +1)
): Record<string, number> {

    const finalStats: Record<string, number> = {};

    const boosterAffectedStats = BOOSTER_MAP[activeBoosterName] || [];
    const isTotalPackage = activeBoosterName === 'Total Package';

    const craftedAffectedStats = BOOSTER_MAP[craftedBoosterName] || [];
    const isCraftedTotalPackage = craftedBoosterName === 'Total Package';

    for (const statName of Object.keys(baseStats)) {
        // 1. Base + Training
        let val = baseStats[statName];

        let trainingBonus = 0;
        for (const [category, affectedStats] of Object.entries(TRAINING_CATEGORIES)) {
            if (affectedStats.includes(statName)) {
                trainingBonus += (allocatedLevels[category] || 0);
            }
        }
        val += trainingBonus;

        // 2. Manager Buff (Threshold based on pre-buff value)
        if (managerProficiency > 0 && MANAGER_THRESHOLDS[managerProficiency]) {
            const thresholds = MANAGER_THRESHOLDS[managerProficiency];
            let buff = 0;
            for (const t of thresholds) {
                if (val >= t.threshold) {
                    buff = t.bonus;
                    break;
                }
            }
            val += buff;
        }

        // 3. Fixed Booster
        if (isTotalPackage) {
            if (!statName.startsWith('GK')) val += boosterLevel;
        } else {
            if (boosterAffectedStats.includes(statName)) val += boosterLevel;
        }

        // 4. Crafted Booster (Always +1)
        if (craftedBoosterName !== 'NONE') {
            if (isCraftedTotalPackage) {
                if (!statName.startsWith('GK')) val += 1;
            } else {
                if (craftedAffectedStats.includes(statName)) val += 1;
            }
        }

        // 5. Manager Stat Boost (Always +1)
        if (managerBoostStats.includes(statName)) {
            val += 1;
        }

        finalStats[statName] = val;
    }

    return finalStats;
}
