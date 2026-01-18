export type BoosterCategory = 'Universal' | 'Attack' | 'Defense' | 'GK' | 'Unique' | 'Conditional';

export interface BoosterDef {
    name: string;
    stats: string[];
}

export const BOOSTERS_BY_CATEGORY: Record<BoosterCategory, BoosterDef[]> = {
    'Universal': [
        { name: 'Agility', stats: ['Speed', 'Acceleration', 'Balance', 'Stamina'] },
        { name: 'Free Kick', stats: ['Finishing', 'Place Kicking', 'Curl', 'Kicking Power'] },
        { name: 'Aerial', stats: ['Finishing', 'Heading', 'Jump', 'Physical Contact'] },
        { name: 'Physical', stats: ['Jump', 'Physical Contact', 'Balance', 'Stamina'] },
    ],
    'Attack': [
        { name: 'Technique', stats: ['Ball Control', 'Dribbling', 'Tight Possession', 'Low Pass'] },
        { name: 'Passing', stats: ['Low Pass', 'Lofted Pass', 'Curl', 'Kicking Power'] },
        { name: 'Shooting', stats: ['Ball Control', 'Finishing', 'Kicking Power', 'Physical Contact'] },
        { name: 'Ball Carry', stats: ['Dribbling', 'Tight Possession', 'Speed', 'Balance'] },
        { name: 'Striker Sense', stats: ['Offensive Awareness', 'Ball Control', 'Finishing', 'Acceleration'] },
        { name: 'Cross', stats: ['Lofted Pass', 'Curl', 'Speed', 'Stamina'] },
        { name: 'Fantasista', stats: ['Ball Control', 'Dribbling', 'Finishing', 'Balance'] },
    ],
    'Defense': [
        { name: 'Defense', stats: ['Defensive Awareness', 'Tackling', 'Acceleration', 'Jump'] },
        { name: 'Duel', stats: ['Defensive Awareness', 'Tackling', 'Speed', 'Stamina'] },
        { name: 'Shutdown', stats: ['Defensive Awareness', 'Tackling', 'Defensive Engagement', 'Speed'] },
        { name: 'Hard Work', stats: ['Aggression', 'Acceleration', 'Physical Contact', 'Stamina'] },
    ],
    'GK': [
        { name: 'Goalkeeping', stats: ['GK Awareness', 'GK Catching', 'GK Clearing', 'GK Collapsing'] },
        { name: 'Goal Saving', stats: ['GK Awareness', 'GK Clearing', 'GK Collapsing', 'GK Parrying'] },
    ],
    'Unique': [
        { name: 'Bearer of Fate', stats: ['Finishing', 'Heading', 'Speed', 'Acceleration'] },
        { name: 'Son of God', stats: ['Dribbling', 'Low Pass', 'Finishing', 'Kicking Power'] },
        { name: 'King', stats: ['Dribbling', 'Ball Control', 'Tight Possession', 'Physical Contact'] },
        { name: 'Little Prince', stats: ['Offensive Awareness', 'Low Pass', 'Finishing', 'Kicking Power'] },
        { name: 'Rare Genius', stats: ['Offensive Awareness', 'Ball Control', 'Dribbling', 'Physical Contact'] },
        { name: 'Magical', stats: ['Offensive Awareness', 'Dribbling', 'Tight Possession', 'Acceleration'] },
        { name: 'Ball Protection', stats: ['Ball Control', 'Tight Possession', 'Physical Contact', 'Balance'] },
        { name: 'Regista', stats: ['Tight Possession', 'Low Pass', 'Defensive Awareness', 'Tackling'] },
        { name: 'Strength', stats: ['Speed', 'Kicking Power', 'Jump', 'Physical Contact'] },
        { name: 'Aerial Block', stats: ['Heading', 'Defensive Awareness', 'Jump', 'Physical Contact'] },
        { name: 'Off the Ball', stats: ['Offensive Awareness', 'Speed', 'Acceleration', 'Stamina'] },
        { name: 'Balancer', stats: ['Offensive Awareness', 'Defensive Awareness', 'Acceleration', 'Stamina'] },
        { name: 'Rebuild', stats: ['Low Pass', 'Defensive Awareness', 'Aggression', 'Defensive Engagement'] },
        { name: 'Offensive Creator', stats: ['Offensive Awareness', 'Ball Control', 'Low Pass', 'Kicking Power'] },
        { name: 'Natural-Born', stats: ['Offensive Awareness', 'Ball Control', 'Dribbling', 'Finishing'] },
        { name: 'Steal', stats: ['Tackling', 'Aggression', 'Acceleration', 'Physical Contact'] },
        { name: 'Accuracy', stats: ['Low Pass', 'Lofted Pass', 'Finishing', 'Kicking Power'] },
        { name: 'Counter', stats: ['Low Pass', 'Tackling', 'Defensive Engagement', 'Physical Contact'] },
        { name: 'Breakthrough', stats: ['Dribbling', 'Speed', 'Kicking Power', 'Physical Contact'] },
        { name: 'Striking', stats: ['Offensive Awareness', 'Acceleration', 'Kicking Power', 'Physical Contact'] },
    ],
    'Conditional': [
        // Total Package affects ALL stats. 
        // We treat this specially in the calculator or list all stats here.
        // Listing all stats is safer for generic logic.
        { name: 'Total Package', stats: ['ALL'] },
    ]
};

// Flat map for easy lookup
export const BOOSTER_MAP: Record<string, string[]> = {};
Object.values(BOOSTERS_BY_CATEGORY).flat().forEach(b => {
    BOOSTER_MAP[b.name] = b.stats;
});
