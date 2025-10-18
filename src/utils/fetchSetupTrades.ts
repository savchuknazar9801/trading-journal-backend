import { Trade } from '../types/journal.js';
import { firestore } from '../configs/firebase.js';
import { Request } from 'express';

export const fetchSetupTrades = async (req: Request, setupId: string): Promise<Trade[]> => {
    const user = req.user;
    

    // Get all User's trade containing setupId
    const tradesSnapshot = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('journalEntries')
        .where('setupId', '==', setupId)
        .get();

    if (tradesSnapshot.empty) {
        return [];
    }

    return tradesSnapshot.docs.map((doc) => doc.data().trade as Trade);
}