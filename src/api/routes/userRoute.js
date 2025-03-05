import express from 'express';
import userController from '../../controllers/userController.js';
import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';

const { signup, login } = userController;

const router = express.Router();

// Signup endpoint
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Example of a protected route
router.get('/profile', isAuth, attachCurrentUser, (req, res) => {
  res.status(200).send(req.user);
});

export default router;