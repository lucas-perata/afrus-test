import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { Transaction } from '../entities/Transaction';

export class ReportController {
    async getFilteredProducts(req: Request, res: Response) {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            
            const products = await productRepository
                .createQueryBuilder('product')
                .where('product.price > :price', { price: 50 })
                .andWhere('product.stockQuantity < :stock', { stock: 20 })
                .getMany();

            return res.json({
                timestamp: new Date(),
                count: products.length,
                data: products
            });
        } catch (error) {
            console.error('Error in getFilteredProducts:', error);
            return res.status(500).json({
                message: 'Error fetching filtered products',
                error: error.message
            });
        }
    }

    async getTransactionReport(req: Request, res: Response) {
        try {
            const transactionRepository = AppDataSource.getRepository(Transaction);
            
            const transactions = await transactionRepository
                .createQueryBuilder('transaction')
                .leftJoinAndSelect('transaction.customer', 'customer')
                .select([
                    'transaction.id',
                    'customer.firstName',
                    'customer.lastName',
                    'customer.documentId',
                    'customer.documentType',
                    'transaction.paidPrice',
                    'transaction.transactionDate',
                    'transaction.relatedEventId'
                ])
                .getMany();

            return res.json({
                timestamp: new Date(),
                count: transactions.length,
                data: transactions
            });
        } catch (error) {
            console.error('Error in getTransactionReport:', error);
            return res.status(500).json({
                message: 'Error fetching transaction report',
                error: error.message
            });
        }
    }
}