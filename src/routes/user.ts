import express, { Request, Response} from 'express';
import { createUser, getUser, updateEmail, updatePassword, updateName, updateSubscription, deleteUser, userVerified, updatePhoto } from '../controllers/users.js';
import { authenticate } from '../middleware/auth.js';
import { sendVerificationEmail } from '../utils/sendEmails.js';

const router = express.Router();

// ================================================================
// ============================ ROUTES ============================
// ================================================================

// Create User
router.post('/', createUser);

// Fetch UserRecord
router.get('/me', authenticate, getUser);

/**
 * Update Full Profile (handy when changing several stuff -> to be implemented later)
 */
router.put('/me', authenticate, (req: Request, res: Response) => {
    // TOODO
})

// Update email
router.patch('/me/email', authenticate, updateEmail);

// Update password
router.patch('/me/password', authenticate, updatePassword);

// Update name
router.patch('/me/name', authenticate, updateName);

// Update subscription 
router.patch('/me/subscription', authenticate, updateSubscription);

// Delete User 
router.delete('/me', authenticate, deleteUser);

// User Verified 
router.get('/verified/:firstName/:email', userVerified);

// Update Photo 
router.patch('/me/photo', authenticate, updatePhoto);


// ================================================================
// ======================== END ROUTES ============================
// ================================================================

export default router;