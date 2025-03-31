import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import config from "../../config.js";
import IRoleController from '../../application/controllers/IControllers/IRoleController.js';

const router = Router();

export default (app: Router) => {
    app.use('/roles', router);

    const ctrl = Container.get(config.controllers.role.name) as IRoleController;

    router.post('/create',
        celebrate({
            body: Joi.object({
                name: Joi.string().required()
            }),
        }),
        (req, res, next) => {
            ctrl.createRole(req, res, next);
        });
}

