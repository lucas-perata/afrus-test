import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const API_BASE_URL = 'http://localhost:3000/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

interface Transaction {
    id: number;
    customer: {
        firstName: string;
        lastName: string;
        documentId: string;
        documentType: string;
    };
    paidPrice: number;
    date: string;
    relatedEventId: string;
}

export class ReportService {
    private readonly axios = axios.create({
        baseURL: API_BASE_URL,
        timeout: 5000,
    });

    async getFilteredProducts(): Promise<Product[]> {
        try {
            const response = await this.axios.get('/reports/filtered-products');
            if (!response.data) {
                throw new Error('No data received from filtered products endpoint');
            }
            return response.data.data || [];
        } catch (error: any) {
            console.error('Error fetching filtered products:', error.message);
            throw new Error(`Failed to fetch filtered products: ${error.message}`);
        }
    }

    async getTransactionReport(): Promise<Transaction[]> {
        try {
            const response = await this.axios.get('/reports/transactions');
            if (!response.data) {
                throw new Error('No data received from transactions endpoint');
            }
            return response.data.data || [];
        } catch (error: any) {
            console.error('Error fetching transaction report:', error.message);
            throw new Error(`Failed to fetch transaction report: ${error.message}`);
        }
    }

    async generateReports(): Promise<void> {
        console.log('Starting report generation...');

        try {
            console.log('Fetching filtered products...');
            const filteredProducts = await this.getFilteredProducts();
            console.log(`Found ${filteredProducts.length} filtered products`);

            const productsReport = {
                generatedAt: new Date().toISOString(),
                totalProducts: filteredProducts.length,
                products: filteredProducts
            };

            console.log('Fetching transaction report...');
            const transactions = await this.getTransactionReport();
            console.log(`Found ${transactions.length} transactions`);

            const transactionsReport = {
                generatedAt: new Date().toISOString(),
                totalTransactions: transactions.length,
                transactions: transactions.map(t => ({
                    transactionId: t.id,
                    customerName: `${t.customer.firstName} ${t.customer.lastName}`,
                    customerId: t.customer.documentId,
                    documentType: t.customer.documentType,
                    amount: t.paidPrice,
                    date: t.date,
                    eventId: t.relatedEventId
                }))
            };

            const reportsDir = path.join(process.cwd(), 'reports');
            await fs.mkdir(reportsDir, { recursive: true });

            console.log('Saving reports...');
            await fs.writeFile(
                path.join(reportsDir, 'filtered-products-report.json'),
                JSON.stringify(productsReport, null, 2)
            );

            await fs.writeFile(
                path.join(reportsDir, 'transactions-report.json'),
                JSON.stringify(transactionsReport, null, 2)
            );

            console.log('Reports generated successfully!');
        } catch (error: any) {
            console.error('Error generating reports:', error.message);
            throw error;
        }
    }
}