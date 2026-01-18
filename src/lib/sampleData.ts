import { Player } from './types';

export const samplePlayer: Player = {
    id: 'messi_sample',
    names: {
        en: 'Lionel Messi',
        jp: 'リオネル メッシ'
    },
    baseStats: {
        'Offensive Awareness': 92,
        'Ball Control': 95,
        'Dribbling': 94,
        'Tight Possession': 96,
        'Low Pass': 89,
        'Lofted Pass': 88,
        'Finishing': 90,
        'Heading': 70,
        'Place Kicking': 93,
        'Curl': 94,
        'Speed': 82,
        'Acceleration': 87,
        'Kicking Power': 85,
        'Jump': 72,
        'Physical Contact': 75,
        'Balance': 95,
        'Stamina': 80,
        'Defensive Awareness': 45,
        'Tackling': 42,
        'Aggression': 48,
        'Defensive Engagement': 40,
        'GK Awareness': 40,
        'GK Catching': 40,
        'GK Parrying': 40,
        'GK Reflexes': 40,
        'GK Reach': 40
    },
    maxLevel: 30,
    data: {
        position: 'SS',
        playStyle: 'Creative Playmaker'
    },
    booster: {
        name: 'King of Football',
        stats: {
            'Ball Control': 2,
            'Tight Possession': 2,
            'Kicking Power': 2,
            'Balance': 2
        }
    }
};
