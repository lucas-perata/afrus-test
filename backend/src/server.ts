import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routes from './routes';

export const createServer = () => {
    const app = express();
    
    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Test route
    app.get('/test', (req, res) => {
        res.json({ message: 'API is working' });
    });

    // Routes
    app.use('/api', routes);

    // Error handling middleware
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('❌ Error:', err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    });

    // 404 middleware
    app.use((req, res) => {
        console.log(`⚠️ Route not found: ${req.method} ${req.path}`);
        res.status(404).json({ message: 'Route not found' });
    });

    return app;
};