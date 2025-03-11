import express from 'express';
import userController from '../../controllers/userController.js';
import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';

const { signup, login, updateUserName } = userController;

const router = express.Router();

// Route para criar uma conta
router.post('/signup', signup);

// Route para login
router.post('/login', login);

// Routes protegidas
// isAuth verifica se o token é válido e o attachCurrentUser anexa o utilizador ao req.user

// Route para atualizar o nome do usuário
router.put('/userName', isAuth, attachCurrentUser, updateUserName);

// Route para obter informações do usuário
router.get('/profile', isAuth, attachCurrentUser, (req, res) => {
  res.status(200).send(req.user);
});

export default router;