export interface Player {
    id: string;
    names: {
        en: string;
        jp?: string;
    };
    baseStats: Record<string, number>;
    maxLevel: number;
    data: {
        position: string;
        playStyle: string;
    };
    booster?: {
        name: string;
        stats: Record<string, number>;
    };
}

export interface TrainingState {
    level: number;
    allocatedPoints: Record<string, number>;
    managerBuff: number;
}
