import { samplePlayer } from './sampleData';

export interface PlayerDef {
    id: string;
    name: string;
    team: string;
    position: string;
    totalPoints: number;
    initialStats: Record<string, number>;
    fixedBooster?: string; // Booster Name
}

// 1. Lionel Messi (Reuse sample data stats)
const MESSI: PlayerDef = {
    id: 'messi_2015',
    name: 'Lionel Messi (2015)',
    team: 'FC Barcelona',
    position: 'RWF',
    totalPoints: 80,
    initialStats: { ...samplePlayer.baseStats },
    fixedBooster: 'Son of God'
};

// 2. Bojan Krkic
// Approximating stats based on "Technique" focus
const BOJAN: PlayerDef = {
    id: 'bojan_krkic',
    name: 'Bojan Krkic',
    team: 'Vissel Kobe',
    position: 'ST',
    totalPoints: 60,
    fixedBooster: 'Technique',
    initialStats: {
        'Offensive Awareness': 73,
        'Ball Control': 89,
        'Dribbling': 92,
        'Tight Possession': 90,
        'Low Pass': 73,
        'Lofted Pass': 68,
        'Finishing': 78,
        'Heading': 60,
        'Place Kicking': 70,
        'Curl': 75,
        'Speed': 80,
        'Acceleration': 84,
        'Kicking Power': 72,
        'Jump': 65,
        'Physical Contact': 55,
        'Balance': 88,
        'Stamina': 70,
        'Defensive Awareness': 40,
        'Tackling': 35,
        'Aggression': 45,
        'Defensive Engagement': 40,
        'GK Awareness': 40,
        'GK Catching': 40,
        'GK Parrying': 40,
        'GK Reflexes': 40,
        'GK Reach': 40
    }
};

export const PLAYERS: PlayerDef[] = [MESSI, BOJAN];

export function getPlayerById(id: string): PlayerDef | undefined {
    return PLAYERS.find(p => p.id === id);
}

export const DEFAULT_PLAYER_ID = MESSI.id;
