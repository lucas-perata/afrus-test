import { createServer } from './server';
import { initializeDB } from './config/initializeDB';

const startApp = async () => {
    try {
        await initializeDB();
        
        const app = createServer();
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
};

// Iniciar la aplicación si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    startApp();
}

// Exportar el servidor para testing
export const app = createServer();