import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createSetup, deleteSetup, getAllSetups, getSingleSetup, getSetupMetrics, updateSetup } from '../controllers/setup.js';

const router = express.Router();

// Ensure all operations are authenticated 
router.use(authenticate);

// Create Setup
router.post('/', createSetup);

// Get all Setups 
router.get('/', getAllSetups);

// Get Setup 
router.get('/:setupId', getSingleSetup);

// Update Setup 
router.put('/:setupId', updateSetup);

// Delete Setup
router.delete('/:setupId', deleteSetup);

// Get Setup Metrics 
router.get('/:setupId/metrics', getSetupMetrics);

export default router;