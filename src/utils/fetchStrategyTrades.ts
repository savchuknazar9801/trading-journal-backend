import { Trade } from '../types/interfaces.js';
import { firestore } from '../configs/firebase.js';
import { Request } from 'express';

export const fetchStrategyTrades = async (req: Request, strategyId: string): Promise<Trade[]> => {
    const user = req.user;

    // Get all User's trade containing strategyId
    const tradesSnapshot = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('trades')
        .where('strategyId', '==', strategyId)
        .orderBy('exitDate', 'desc')
        .get();

    if (tradesSnapshot.empty) {
        return [];
    }

    return tradesSnapshot.docs.map((doc) => doc.data() as Trade);
}