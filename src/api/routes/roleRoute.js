import express from 'express';
import roleController from '../../application/controllers/roleController.js';

const router = express.Router();

// Route para criar um papel
router.post('/create', roleController.createRole);

export default router;