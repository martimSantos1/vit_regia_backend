export class SensorData {
    constructor(
        public readonly temperature: number,
        public readonly ph: number,
        public readonly turbidity: number,
        public readonly tds: number,
        public readonly conductivity: number,
        public readonly dissolvedOxygen: number,
        public timestamp?: string
    ) {
        if (temperature < -50 || temperature > 100) throw new Error('Temperatura inválida');
        if (ph < 0 || ph > 14) throw new Error('PH inválido');
        if (turbidity < 0 || turbidity > 1000) throw new Error('Turbidez inválida');
        if (tds < 0 || tds > 1000) throw new Error('TDS inválido');
        if (conductivity < 0 || conductivity > 1000) throw new Error('Condutividade inválida');
        if (dissolvedOxygen < 0 || dissolvedOxygen > 20) throw new Error('Oxigénio dissolvido inválido');
    }
}
