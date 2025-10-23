import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    createJournalEntry, 
    getAllJournalEntries, 
    deleteJournalEntry, 
    editJournalEntry, 
    getSingleJournalEntry
} from '../controllers/journal.js';


const router = express.Router();

// Middleware for user verification (required for all)
router.use(authenticate);

// Create JournalEntry
router.post('/', createJournalEntry);

// Get Single Journal Entry 
router.get('/:journalEntryId', getSingleJournalEntry);

// Get All JournalEntires
router.get('/', getAllJournalEntries)

// Edit JournalEntry 
router.patch('/:journalEntryId', editJournalEntry);

// Delete Journal Entry
router.delete('/:journalEntryId', deleteJournalEntry);

export default router;