import { Router } from 'express';
import { container } from 'tsyringe';
import { IDataController } from '../../application/controllers/IControllers/IDataController';

const router = Router();

export default (app: Router) => {
    app.use('/data', router);

    const dataController = container.resolve<IDataController>('DataController');

    /**
     * Endpoint para registar dados de sensores.
     * Exemplo de URL: /data/registerData
     * O corpo da requisição deve conter os dados do sensor em formato JSON.
     * Exemplo de corpo da requisição:
     * {
     *   "temperature": 25.5,       // Temperatura em graus Celsius
     *   "ph": 7.0,                // Valor de pH
     *   "turbidity": 1.2,         // Turbidez em NTU
     *   "tds": 300,               // Total de sólidos dissolvidos (TDS) em ppm
     *   "conductivity": 500,      // Condutividade elétrica em µS/cm
     *   "dissolvedOxygen": 8.5    // Oxigénio dissolvido em mg/L
     * }
     */
    router.post("/registerData", async (req, res) => {
        try {
            await dataController.registerData(req, res);
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });

    /**
     * Endpoint para obter os últimos n registos de dados de sensores.
     * Exemplo de URL: /data/getLastData?numberOfData=10
     * O parâmetro de consulta "numberOfData" especifica quantos registos devem ser obtidos.
     * Valores suportados: 1, 5, 10, 20, 50, 100, ...
     * Caso nenhum parâmetro seja fornecido, o valor padrão é 1.
     */
    router.get("/getLastData", async (req, res) => {
        try {
            await dataController.getLastData(req, res);
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });

    /**
     * Endpoint para obter dados de sensores por intervalo de tempo.
     * Exemplo de URL: /data/getDataByRange?range=30d
     * O parâmetro de consulta "range" especifica o intervalo de tempo dos dados a serem obtidos.
     * Intervalos suportados: 1h, 6h, 12h, 1d, 3d, 7d, 30d, 90d, 180d, 1y
     * Caso nenhum intervalo seja especificado, o valor padrão é 30d.
     * Caso o intervalo seja inválido, será retornado um erro.
     */
    router.get("/getDataByRange", async (req, res) => {
        try {
            await dataController.getDataByRange(req, res);
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}