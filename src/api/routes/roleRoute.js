import express from 'express';
import roleController from '../../controllers/roleController.js';

const { createRole } = roleController;

const router = express.Router();

// create endpoint
router.post('/create', createRole);

export default router;