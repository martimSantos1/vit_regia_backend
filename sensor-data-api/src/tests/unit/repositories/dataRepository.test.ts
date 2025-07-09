import { DataRepository } from "../../../infrastructure/repos/dataRepository";
import { SensorData } from "../../../domain/entities/sensorData";
import { Thresholds } from "../../../domain/entities/thresholds";

// Mocks
jest.mock("../../../loaders/influx", () => ({
    getWriteApi: jest.fn(),
    getQueryApi: jest.fn()
}));

import { getWriteApi, getQueryApi } from "../../../loaders/influx";
import { Point } from "@influxdata/influxdb-client";

describe("DataRepository", () => {
    let repository: DataRepository;

    const mockThresholds: Thresholds = {
        temperature: { goodMin: 15, goodMax: 30, alarmingMin: 10, alarmingMax: 35 },
        ph: { goodMin: 6.5, goodMax: 8.5, alarmingMin: 5, alarmingMax: 10 },
        turbidity: { goodMin: 0, goodMax: 50, alarmingMin: 0, alarmingMax: 250 },
        tds: { goodMin: 0, goodMax: 600, alarmingMin: 0, alarmingMax: 1500 },
        dissolvedOxygen: { goodMin: 5, goodMax: 100, alarmingMin: 3, alarmingMax: 100 }
    };

    beforeEach(() => {
        repository = new DataRepository();
    });

    describe("saveSensorData", () => {
        it("deve chamar writeApi com os dados corretos", async () => {
            const flushMock = jest.fn();
            const writeMock = jest.fn();

            (getWriteApi as jest.Mock).mockReturnValue({
                writePoint: writeMock,
                flush: flushMock
            });

            const data = new SensorData(25, 7, 1, 300, 8, mockThresholds);

            await repository.saveSensorData(data);

            expect(writeMock).toHaveBeenCalledWith(expect.any(Point));
            expect(flushMock).toHaveBeenCalled();
        });
    });

    describe("getLastSensorData", () => {
        it("deve retornar instâncias de SensorData válidas", async () => {
            const mockQueryRows = jest.fn((query, handlers) => {
                const row = ["row"];
                const tableMeta = {
                    toObject: () => ({
                        temperature: 25,
                        ph: 7,
                        turbidity: 1,
                        tds: 300,
                        dissolved_oxygen: 8,
                        _time: "2024-01-01T00:00:00Z"
                    })
                };
                handlers.next(row, tableMeta);
                handlers.complete();
            });

            (getQueryApi as jest.Mock).mockReturnValue({ queryRows: mockQueryRows });

            const result = await repository.getLastSensorData(1, mockThresholds, "-5m");

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(SensorData);
            expect(result[0].temperature).toBe(25);
        });

        it("deve lançar erro se a query falhar", async () => {
            const mockQueryRows = jest.fn((_, handlers) => {
                handlers.error(new Error("Erro Influx"));
            });

            (getQueryApi as jest.Mock).mockReturnValue({ queryRows: mockQueryRows });

            await expect(repository.getLastSensorData(1, mockThresholds, "-5m")).rejects.toThrow("Erro ao consultar os dados");
        });
    });

    describe("getDataByRange", () => {
        it("deve retornar instâncias de SensorData válidas", async () => {
            const mockQueryRows = jest.fn((_, handlers) => {
                const row = ["row"];
                const tableMeta = {
                    toObject: () => ({
                        temperature: 24,
                        ph: 7.5,
                        turbidity: 2,
                        tds: 250,
                        dissolved_oxygen: 7,
                        _time: "2024-01-01T00:00:00Z"
                    })
                };
                handlers.next(row, tableMeta);
                handlers.complete();
            });

            (getQueryApi as jest.Mock).mockReturnValue({ queryRows: mockQueryRows });

            const result = await repository.getDataByRange("7d", mockThresholds);

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(SensorData);
            expect(result[0].tds).toBe(250);
        });

        it("deve lançar erro se a query falhar", async () => {
            const mockQueryRows = jest.fn((_, handlers) => {
                handlers.error(new Error("Falha de Influx"));
            });

            (getQueryApi as jest.Mock).mockReturnValue({ queryRows: mockQueryRows });

            await expect(repository.getDataByRange("7d", mockThresholds)).rejects.toThrow("Erro ao consultar os dados por intervalo");
        });
    });
});