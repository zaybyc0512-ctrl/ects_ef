export function calculateTotalPoints(levels: Record<string, number>): number {
    let totalCost = 0;

    for (const level of Object.values(levels)) {
        let statCost = 0;
        // Sum cost for each step up to current level
        for (let i = 1; i <= level; i++) {
            // Formula: floor((i - 1) / 4) + 1
            // i=1..4 => 1
            // i=5..8 => 2
            // etc.
            statCost += Math.floor((i - 1) / 4) + 1;
        }
        totalCost += statCost;
    }

    return totalCost;
}
