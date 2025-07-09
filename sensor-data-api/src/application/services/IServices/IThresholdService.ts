import { Thresholds } from "../../../domain/entities/thresholds";

export interface IThresholdService {
    getThresholds(): Promise<Thresholds>;
    updateThresholds(updated: Partial<Thresholds>): Promise<void>;
}
