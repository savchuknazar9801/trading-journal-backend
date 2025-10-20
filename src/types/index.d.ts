// To ensure that we can use Request.user

declare namespace Express {
    export interface Request {
        user?: any;
    }
}