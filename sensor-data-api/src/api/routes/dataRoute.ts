import { Router } from 'express';
import { container } from 'tsyringe';
import { IDataController } from '../../application/controllers/IControllers/IDataController';

const router = Router();

export default (app: Router) => {
    app.use('/data', router);

    const dataController = container.resolve<IDataController>('DataController');

    router.post("/processData", async (req, res) => {
        try {
            await dataController.receiveData(req, res);
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}