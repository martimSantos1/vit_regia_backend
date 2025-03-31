import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import config from "../../config.js";

import IUserController from '../../application/controllers/IControllers/IUserController.js';
import middlewares from '../middlewares/index.js';

const router = Router();

export default (app: Router) => {
    app.use('/users', router);

    const ctrl = Container.get(config.controllers.user.name) as IUserController;

    router.post('/register',
        celebrate({
            body: Joi.object({
                userName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                roleId: Joi.number()
            }),
        }),
        (req, res, next) => {
            ctrl.register(req, res);
        });


    // Route para login
    //router.post('/login', userController.login);

    // Routes protegidas
    // isAuth verifica se o token é válido e o attachCurrentUser anexa o utilizador ao req.user

    // Route para atualizar o nome do usuário
    // router.put('/userName', middlewares.isAuth, middlewares.attachCurrentUser, updateUserName);

    // Route para obter informações do usuário
    // router.get('/profile', middlewares.isAuth, middlewares.attachCurrentUser, (req, res) => {
    //   res.status(200).send(req.user);
    // });
}