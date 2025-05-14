import { Router } from 'express';
import { DataController } from '../controllers/dataController';

const router = Router();

export default (app: Router) => {
    app.use('/data', router);

    const dataController = new DataController();

    router.post("/processData", async (req, res) => {
        try {
            await dataController.receiveData(req, res);
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}