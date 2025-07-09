import { Thresholds, Threshold } from "./thresholds";

export type Status = "good" | "alarming" | "critical";

export class SensorData {
  public readonly temperatureStatus: Status;
  public readonly phStatus: Status;
  public readonly turbidityStatus: Status;
  public readonly tdsStatus: Status;
  public readonly dissolvedOxygenStatus: Status;

  constructor(
    public readonly temperature: number,
    public readonly ph: number,
    public readonly turbidity: number,
    public readonly tds: number,
    public readonly dissolvedOxygen: number,
    thresholds: Thresholds,
    public readonly timestamp?: string
  ) {
    const t = thresholds;

    if (temperature < -50 || temperature > 100) throw new Error("Temperatura inválida");
    if (ph < 0 || ph > 14) throw new Error("PH inválido");

    this.temperatureStatus = this.computeStatus(temperature, t.temperature);
    this.phStatus = this.computeStatus(ph, t.ph);
    this.turbidityStatus = this.computeStatus(turbidity, t.turbidity);
    this.tdsStatus = this.computeStatus(tds, t.tds);
    this.dissolvedOxygenStatus = this.computeStatus(dissolvedOxygen, t.dissolvedOxygen);
  }

  private computeStatus(value: number, { goodMin, goodMax, alarmingMin, alarmingMax }: Threshold): Status {
    if (value >= goodMin && value <= goodMax) return "good";
    if (value >= alarmingMin && value <= alarmingMax) return "alarming";
    return "critical";
  }
}