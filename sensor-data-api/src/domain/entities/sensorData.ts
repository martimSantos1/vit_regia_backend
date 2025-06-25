export type Status = "good" | "alarming" | "critical";

export class SensorData {
  public readonly temperatureStatus: Status;
  public readonly phStatus: Status;
  public readonly turbidityStatus: Status;
  public readonly tdsStatus: Status;
  public readonly conductivityStatus: Status;
  public readonly dissolvedOxygenStatus: Status;

  constructor(
    public readonly temperature: number,
    public readonly ph: number,
    public readonly turbidity: number,
    public readonly tds: number,
    public readonly conductivity: number,
    public readonly dissolvedOxygen: number,
    public readonly timestamp?: string
  ) {
    if (temperature < -50 || temperature > 100) throw new Error("Temperatura inválida");
    if (ph < 0 || ph > 14) throw new Error("PH inválido");
    if (turbidity < 0 || turbidity > 1000) throw new Error("Turbidez inválida");
    if (tds < 0 || tds > 1000) throw new Error("TDS inválido");
    if (conductivity < 0 || conductivity > 1000) throw new Error("Condutividade inválida");
    if (dissolvedOxygen < 0 || dissolvedOxygen > 20) throw new Error("Oxigénio dissolvido inválido");

    this.temperatureStatus = this.computeTemperatureStatus(temperature);
    this.phStatus = this.computePhStatus(ph);
    this.turbidityStatus = this.computeTurbidityStatus(turbidity);
    this.tdsStatus = this.computeTdsStatus(tds);
    this.conductivityStatus = this.computeConductivityStatus(conductivity);
    this.dissolvedOxygenStatus = this.computeOxygenStatus(dissolvedOxygen);
  }

  private computeTemperatureStatus(value: number): Status {
    if (value >= 15 && value <= 30) return "good";
    if (value >= 10 && value < 15 || value > 30 && value <= 35) return "alarming";
    return "critical";
  }

  private computePhStatus(value: number): Status {
    if (value >= 6.5 && value <= 8.5) return "good";
    if ((value >= 6 && value < 6.5) || (value > 8.5 && value <= 9)) return "alarming";
    return "critical";
  }

  private computeTurbidityStatus(value: number): Status {
    if (value <= 5) return "good";
    if (value <= 50) return "alarming";
    return "critical";
  }

  private computeTdsStatus(value: number): Status {
    if (value <= 300) return "good";
    if (value <= 600) return "alarming";
    return "critical";
  }

  private computeConductivityStatus(value: number): Status {
    if (value <= 500) return "good";
    if (value <= 800) return "alarming";
    return "critical";
  }

  private computeOxygenStatus(value: number): Status {
    if (value >= 5) return "good";
    if (value >= 3) return "alarming";
    return "critical";
  }
}
