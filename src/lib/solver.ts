import { PlayerDef } from './playerData';
import { TargetStat } from '../components/TargetSettingsModal';
import { TRAINING_CATEGORIES } from './constants';
import { calculateStats } from './calculator';
import { calculateTotalPoints } from './pointCosts';

export function solveAllocation(
    player: PlayerDef,
    // Config
    managerProficiency: number,
    boosterName: string,
    boosterLevel: number,
    managerBoostStats: string[],
    craftedBoosterName: string,
    // Constraints
    targets: Record<string, TargetStat>,
    availablePoints: number // Budget
): Record<string, number> {

    // 1. Initialize Levels to 0 (Clean Slate)
    const levels: Record<string, number> = {};
    Object.keys(TRAINING_CATEGORIES).forEach(c => levels[c] = 0);

    // 2. Sort Targets by Priority (Ascending: 1, 2, 3...)
    const sortedTargets = Object.entries(targets)
        .sort(([, a], [, b]) => a.priority - b.priority);

    // Helper to check if affordable
    const isAffordable = (newLevels: Record<string, number>) => {
        return calculateTotalPoints(newLevels) <= availablePoints;
    };

    // Helper: Find category for a stat
    const getCategory = (stat: string) => {
        return Object.keys(TRAINING_CATEGORIES).find(c => TRAINING_CATEGORIES[c].includes(stat));
    };

    // 3. Process Each Target
    for (const [statName, target] of sortedTargets) {
        const category = getCategory(statName);
        if (!category) continue; // Should not happen

        const targetValue = target.value;

        // We already have some levels allocated from previous higher-priority targets.
        // We need to see if current state meets target.
        // If not, we increment the category level until it meets target OR we run out of budget/max level.

        // Check current value
        // Optimization: We can just use calculateStats on current levels. 
        // It's slightly inefficient to recalc ALL stats every step, but for <50 iterations it's negligible.

        // Iterate from current level upwards
        let bestLevelForCategory = levels[category];
        let found = false;

        // Try increasing level step by step
        for (let l = levels[category]; l <= 99; l++) { // Max level usually lower, but bounded by budget
            // Construct temp levels
            const tempLevels = { ...levels, [category]: l };

            // Check Budget FIRST
            if (!isAffordable(tempLevels)) {
                // Cannot go higher. Stop trying for this target.
                // We revert to the last valid level (bestLevelForCategory) which was the STARTing level of this loop usually, 
                // or whatever we successfully committed to.
                break;
            }

            // Check Stat Value
            const currentStats = calculateStats(
                player.initialStats,
                tempLevels,
                managerProficiency,
                boosterName,
                boosterLevel,
                managerBoostStats,
                craftedBoosterName
            );

            if (currentStats[statName] >= targetValue) {
                // Target Met!
                bestLevelForCategory = l;
                found = true;
                break; // Stop incrementing, we found the minimum level to meet target
            }
        }

        // Apply result
        if (found) {
            levels[category] = bestLevelForCategory;
        } else {
            // If we couldn't meet the target (due to budget or max stats), 
            // we generally do NOT partially allocate. We stay at the previous level 
            // to save points for other targets that might be reachable.
            // So we do nothing to `levels` here.
        }
    }

    return levels;
}
