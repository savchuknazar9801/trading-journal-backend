import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import userRoutes from './routes/user.js';
import journalRoutes from './routes/journal.js';
import setupRoutes from './routes/setup.js';
import planRoutes from './routes/plan.js';
import metatrader5Routes from './routes/metatrader5.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { rateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Enable cross origin 
const corsOptions = {
    origin: ['https://trackedge.io', 'https://www.trackedge.io', 'http://localhost:8080'],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, 
};

app.use(cors(corsOptions));

// Allows for the use of json requests
app.use(express.json());

// Apply rate limiter to all requests
app.use(rateLimiter);

// ==============================================================================
// ================================= ROUTES =====================================
// ==============================================================================

app.get('/', (req: Request, res: Response) => {
    res.send('TrackEdge API is active!');
})

// Routers
app.use('/users', userRoutes);
app.use('/journals', journalRoutes);
app.use('/setups', setupRoutes);
app.use('/plans', planRoutes);
app.use('/metatrader5', metatrader5Routes);


// 404 handler for undefined routes 
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

// Global error handler - always keep this as the last middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`TrackEdge API is listening on port ${port}`);
});
