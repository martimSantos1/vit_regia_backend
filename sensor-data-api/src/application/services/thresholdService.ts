import { injectable } from 'tsyringe';
import fs from 'fs/promises';
import path from 'path';
import { Thresholds } from '../../domain/entities/thresholds';
import { IThresholdService } from './IServices/IThresholdService';

const THRESHOLDS_PATH = path.resolve(__dirname, '../../domain/config/thresholds.json');

@injectable()
export class ThresholdService implements IThresholdService {
    async getThresholds(): Promise<Thresholds> {
        const data = await fs.readFile(THRESHOLDS_PATH, 'utf-8');
        return JSON.parse(data) as Thresholds;
    }

    async updateThresholds(updated: Partial<Thresholds>): Promise<void> {
        const current = await this.getThresholds();
        const merged = { ...current, ...updated };
        await fs.writeFile(THRESHOLDS_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    }
}