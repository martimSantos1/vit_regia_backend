export class SensorData {
    constructor(
        public readonly temperature: number,
        public readonly ph: number
    ) {
        if (ph < 0 || ph > 14) throw new Error('PH fora do intervalo realista');
        if (temperature < -50 || temperature > 100) throw new Error('Temperatura inválida');
    }
}
