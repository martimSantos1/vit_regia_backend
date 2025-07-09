import { DataController } from "../../../application/controllers/dataController";
import { IDataService } from "../../../application/services/IServices/IDataService";
import { IThresholdService } from "../../../application/services/IServices/IThresholdService";
import { Request, Response } from "express";

// Mocks Express
const mockRequest = () => ({ body: {}, query: {} } as Partial<Request>) as Request;
const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("DataController", () => {
  let dataService: jest.Mocked<IDataService>;
  let thresholdService: jest.Mocked<IThresholdService>;
  let controller: DataController;

  beforeEach(() => {
    dataService = {
      registerSensorData: jest.fn(),
      getLastSensorData: jest.fn(),
      getDataByRange: jest.fn()
    } as unknown as jest.Mocked<IDataService>;

    thresholdService = {
      getThresholds: jest.fn(),
      updateThresholds: jest.fn()
    } as unknown as jest.Mocked<IThresholdService>;

    controller = new DataController(dataService, thresholdService);
  });

  describe("registerData", () => {
    it("deve responder 200 em caso de sucesso", async () => {
      const req = mockRequest();
      req.body = {
        temperature: 25,
        ph: 7,
        turbidity: 1,
        tds: 300,
        dissolvedOxygen: 8
      };
      const res = mockResponse();

      dataService.registerSensorData.mockResolvedValue(req.body as any);

      await controller.registerData(req, res);

      expect(dataService.registerSensorData).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Dados recebidos com sucesso" });
    });

    it("deve responder 400 se os dados forem inválidos", async () => {
      const req = mockRequest();
      req.body = { temperature: "invalido" }; // quebra validação Zod
      const res = mockResponse();

      await controller.registerData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Dados inválidos" });
    });
  });

  describe("getLastData", () => {
    it("deve responder 200 com dados", async () => {
      const req = mockRequest();
      req.query = { numberOfData: "2" };
      const res = mockResponse();

      const mockData = [{ temperature: 25 }, { temperature: 26 }];

      dataService.getLastSensorData.mockResolvedValue(mockData as any);

      await controller.getLastData(req, res);

      expect(dataService.getLastSensorData).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Últimos 2 dados recebidos com sucesso",
        data: mockData
      });
    });

    it("deve responder 404 se não houver dados", async () => {
      const req = mockRequest();
      req.query = { numberOfData: "2" };
      const res = mockResponse();

      dataService.getLastSensorData.mockResolvedValue([]);

      await controller.getLastData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Nenhum dado encontrado." });
    });

    it("deve responder 500 em caso de erro", async () => {
      const req = mockRequest();
      req.query = { numberOfData: "1" };
      const res = mockResponse();

      dataService.getLastSensorData.mockRejectedValue(new Error("Erro simulado"));

      await controller.getLastData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro simulado" });
    });
  });

  describe("getDataByRange", () => {
    it("deve responder 200 com dados", async () => {
      const req = mockRequest();
      req.query = { range: "7d" };
      const res = mockResponse();

      const mockData = [{ temperature: 24 }];
      dataService.getDataByRange.mockResolvedValue(mockData as any);

      await controller.getDataByRange(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Dados obtidos com sucesso para o intervalo 7d",
        data: mockData
      });
    });

    it("deve responder 404 se não houver dados", async () => {
      const req = mockRequest();
      req.query = { range: "1d" };
      const res = mockResponse();

      dataService.getDataByRange.mockResolvedValue([]);

      await controller.getDataByRange(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Nenhum dado encontrado para o intervalo especificado." });
    });

    it("deve responder 500 em caso de erro", async () => {
      const req = mockRequest();
      const res = mockResponse();

      dataService.getDataByRange.mockRejectedValue(new Error("Erro interno"));

      await controller.getDataByRange(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
    });
  });

  describe("getThresholds", () => {
    it("deve responder 200 com os thresholds", async () => {
      const req = mockRequest();
      const res = mockResponse();

      thresholdService.getThresholds.mockResolvedValue({ temperature: { goodMin: 1, goodMax: 2, alarmingMin: 0, alarmingMax: 3 } } as any);

      await controller.getThresholds(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Limiar de sensores obtido com sucesso",
        thresholds: expect.any(Object)
      });
    });

    it("deve responder 500 em caso de erro", async () => {
      const req = mockRequest();
      const res = mockResponse();

      thresholdService.getThresholds.mockRejectedValue(new Error("Erro"));

      await controller.getThresholds(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro" });
    });
  });

  describe("updateThresholds", () => {
    it("deve responder 200 após atualização", async () => {
      const req = mockRequest();
      req.body = { temperature: { goodMin: 10, goodMax: 30, alarmingMin: 5, alarmingMax: 35 } };
      const res = mockResponse();

      await controller.updateThresholds(req, res);

      expect(thresholdService.updateThresholds).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Limiar de sensores atualizado com sucesso" });
    });

    it("deve responder 500 em caso de erro", async () => {
      const req = mockRequest();
      req.body = { ph: {} };
      const res = mockResponse();

      thresholdService.updateThresholds.mockRejectedValue(new Error("Falha"));

      await controller.updateThresholds(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Falha" });
    });
  });
});
