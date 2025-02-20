import { DataSource } from 'typeorm';
import { AppDataSource } from './database';

export const initializeDB = async (): Promise<DataSource> => {
    try {
        const dataSource = await AppDataSource.initialize();
        console.log('✅ Database connected');
        return dataSource;
    } catch (error) {
        console.error('❌ Database connection error:', error);
        throw error;
    }
};

export const closeDB = async (): Promise<void> => {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
};