import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createMT5Account, initialMT5Sync } from '../controllers/metatrader5.js';

const router = express.Router();

// Middleware for user verification (required for all)
router.use(authenticate)

// Create a MT5 account in system and initialise data
router.post('/', createMT5Account);

export default router;