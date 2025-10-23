import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createPlan, deletePlan, getAllPlans, getSinglePlan, updatePlan } from '../controllers/plan.js';

// Initialise router
const router = express.Router();

// Ensure all function calls are authenticated 
router.use(authenticate);

// Create Plan
router.post('/', createPlan);

// Get All Plan 
router.get('/', getAllPlans);

// Get Plan 
router.get('/:planId', getSinglePlan);

// Update Plan 
router.put('/:planId', updatePlan);

// Delete Plan 
router.delete('/:planId', deletePlan);

export default router;