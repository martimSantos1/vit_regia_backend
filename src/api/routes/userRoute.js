import express from 'express';
import userController from '../../application/controllers/userController.js';
import middlewares from '../middlewares/index.js';

const router = express.Router();

// Route para criar uma conta
router.post('/signup', userController.register);

// Route para login
router.post('/login', userController.login);

// Routes protegidas
// isAuth verifica se o token é válido e o attachCurrentUser anexa o utilizador ao req.user

// Route para atualizar o nome do usuário
// router.put('/userName', middlewares.isAuth, middlewares.attachCurrentUser, updateUserName);

// Route para obter informações do usuário
// router.get('/profile', middlewares.isAuth, middlewares.attachCurrentUser, (req, res) => {
//   res.status(200).send(req.user);
// });

export default router;