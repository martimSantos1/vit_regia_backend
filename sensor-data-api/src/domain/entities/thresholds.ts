export interface Threshold {
    goodMin: number;
    goodMax: number;
    alarmingMin: number;
    alarmingMax: number;
}

export type Thresholds = {
    temperature: Threshold;
    ph: Threshold;
    turbidity: Threshold;
    tds: Threshold;
    dissolvedOxygen: Threshold;
};
