import { DataController } from "../../application/controllers/dataController";
import { DataService } from "../../application/services/dataService";
import { IDataRepository } from "../../domain/repositories/IDataRepository";
import { ThresholdService } from "../../application/services/thresholdService";
import { Request, Response } from "express";
import { SensorData } from "../../domain/entities/sensorData";
import { Thresholds } from "../../domain/entities/thresholds";

// Express mocks
const mockRequest = () => ({ body: {}, query: {} } as Partial<Request>) as Request;
const mockResponse = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Thresholds para testes
const mockThresholds: Thresholds = {
    temperature: { goodMin: 15, goodMax: 30, alarmingMin: 10, alarmingMax: 35 },
    ph: { goodMin: 6.5, goodMax: 8.5, alarmingMin: 5, alarmingMax: 10 },
    turbidity: { goodMin: 0, goodMax: 50, alarmingMin: 0, alarmingMax: 250 },
    tds: { goodMin: 0, goodMax: 600, alarmingMin: 0, alarmingMax: 1500 },
    dissolvedOxygen: { goodMin: 5, goodMax: 100, alarmingMin: 3, alarmingMax: 100 }
};

describe("Integração: DataController + DataService", () => {
    let repository: jest.Mocked<IDataRepository>;
    let thresholdService: jest.Mocked<ThresholdService>;
    let service: DataService;
    let controller: DataController;

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
        controller = new DataController(service, thresholdService);
    });

    it("registerData: deve passar por controller e service corretamente", async () => {
        const req = mockRequest();
        req.body = {
            temperature: 25,
            ph: 7,
            turbidity: 1,
            tds: 300,
            dissolvedOxygen: 8
        };

        const res = mockResponse();

        const spy = jest.spyOn(service, "registerSensorData");

        await controller.registerData(req, res);

        expect(spy).toHaveBeenCalledWith(req.body);
        expect(repository.saveSensorData).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Dados recebidos com sucesso" });
    });

    it("getLastData: deve retornar os últimos dados", async () => {
        const req = mockRequest();
        req.query = { numberOfData: "2" };
        const res = mockResponse();

        const mockData = [
            new SensorData(25, 7, 1, 300, 8, mockThresholds),
            new SensorData(24, 7.1, 1.1, 310, 7.9, mockThresholds)
        ];

        repository.getLastSensorData.mockResolvedValue(mockData);

        await controller.getLastData(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Últimos 2 dados recebidos com sucesso",
            data: expect.any(Array)
        });
    });

    it("getDataByRange: deve retornar dados válidos", async () => {
        const req = mockRequest();
        req.query = { range: "7d" };
        const res = mockResponse();

        const mockData = [
            new SensorData(25, 7, 1, 300, 8, mockThresholds)
        ];

        repository.getDataByRange.mockResolvedValue(mockData);

        await controller.getDataByRange(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Dados obtidos com sucesso para o intervalo 7d",
            data: expect.any(Array)
        });
    });
});