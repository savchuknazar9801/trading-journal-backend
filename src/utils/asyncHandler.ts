import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (func: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(func(req, res, next)).catch((error) => next(error));
    }
}