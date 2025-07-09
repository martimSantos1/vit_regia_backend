import { DataService } from "../../../application/services/dataService";
import { IDataRepository } from "../../../domain/repositories/IDataRepository";
import { ThresholdService } from "../../../application/services/thresholdService";
import { SensorData } from "../../../domain/entities/sensorData";
import admin from "firebase-admin";

jest.mock("firebase-admin", () => ({
    messaging: jest.fn().mockReturnThis(),
    send: jest.fn()
}));

const mockThresholds = {
    temperature: { goodMin: 15, goodMax: 30, alarmingMin: 10, alarmingMax: 35 },
    ph: { goodMin: 6.5, goodMax: 8.5, alarmingMin: 5, alarmingMax: 10 },
    turbidity: { goodMin: 0, goodMax: 50, alarmingMin: 0, alarmingMax: 250 },
    tds: { goodMin: 0, goodMax: 600, alarmingMin: 0, alarmingMax: 1500 },
    dissolvedOxygen: { goodMin: 5, goodMax: 100, alarmingMin: 3, alarmingMax: 100 }
};

describe("DataService", () => {
    let repository: jest.Mocked<IDataRepository>;
    let thresholdService: jest.Mocked<ThresholdService>;
    let service: DataService;

    beforeEach(() => {
        repository = {
            saveSensorData: jest.fn(),
            getLastSensorData: jest.fn(),
            getDataByRange: jest.fn()
        } as unknown as jest.Mocked<IDataRepository>;

        thresholdService = {
            getThresholds: jest.fn().mockResolvedValue(mockThresholds),
            updateThresholds: jest.fn()
        } as unknown as jest.Mocked<ThresholdService>;

        service = new DataService(repository, thresholdService);
    });

    describe("registerSensorData", () => {
        it("deve criar e guardar dados válidos", async () => {
            const input = {
                temperature: 25,
                ph: 7,
                turbidity: 1,
                tds: 300,
                dissolvedOxygen: 8
            };

            const result = await service.registerSensorData(input);

            expect(thresholdService.getThresholds).toHaveBeenCalled();
            expect(repository.saveSensorData).toHaveBeenCalled();
            expect(result).toEqual(input);
        });

        it("deve lançar erro se os dados forem inválidos", async () => {
            await expect(
                service.registerSensorData({ temperature: 500, ph: 1, turbidity: 1, tds: 100, dissolvedOxygen: 5 })
            ).rejects.toThrow("Dados inválidos");
        });
    });

    describe("getLastSensorData", () => {
        it("deve retornar dados corretamente", async () => {
            const mockSensorData = [
                new SensorData(25, 7, 1, 300, 8, mockThresholds)
            ];
            repository.getLastSensorData.mockResolvedValue(mockSensorData);

            const result = await service.getLastSensorData(1);

            expect(thresholdService.getThresholds).toHaveBeenCalled();
            expect(repository.getLastSensorData).toHaveBeenCalledWith(expect.any(Number), mockThresholds, expect.any(String));
            expect(result).toHaveLength(1);
        });

        it("deve lançar erro se número for inválido", async () => {
            await expect(service.getLastSensorData(0)).rejects.toThrow("Erro ao obter os últimos dados");
        });
    });

    describe("getDataByRange", () => {
        it("deve retornar dados válidos para range válido", async () => {
            const mockSensorData = [
                new SensorData(26, 7, 2, 300, 8, mockThresholds)
            ];
            repository.getDataByRange.mockResolvedValue(mockSensorData);

            const result = await service.getDataByRange("7d");

            expect(repository.getDataByRange).toHaveBeenCalledWith("7d", mockThresholds);
            expect(result).toHaveLength(1);
        });

        it("deve lançar erro se range for inválido", async () => {
            await expect(service.getDataByRange("999d")).rejects.toThrow("Erro ao obter dados por intervalo");
        });
    });

    describe("checkAndSendCriticalAlert", () => {
        it("deve enviar alerta crítico se necessário", async () => {
            const sensorData = new SensorData(100, 2, 500, 3000, 1, mockThresholds);

            const sendMock = jest.fn().mockResolvedValue(undefined);
            (admin.messaging as any).mockReturnValue({ send: sendMock });

            await service["checkAndSendCriticalAlert"](sensorData);

            expect(sendMock).toHaveBeenCalled();
        });

        it("não deve enviar alerta se os dados forem bons", async () => {
            const sensorData = new SensorData(25, 7, 10, 200, 8, mockThresholds);

            const sendMock = jest.fn();
            (admin.messaging as any).mockReturnValue({ send: sendMock });

            await service["checkAndSendCriticalAlert"](sensorData);

            expect(sendMock).not.toHaveBeenCalled();
        });
    });
});