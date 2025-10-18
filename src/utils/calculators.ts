import { MetatraderDeal } from "../types/metatrader.js";

export const calculateHoldingTime = (entryDate: string, exitDate: string) => {
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);

    // Calculate differences in milliseconds 
    const diffInMs = exit.getTime() - entry.getTime();

    // Convert to minutes
    const diffInMinutes = diffInMs / (1000 * 60);

    return Math.round(diffInMinutes);
}