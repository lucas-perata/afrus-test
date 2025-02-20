import { Customer, Transaction, CustomerEvent } from '@/entities';
import { AppDataSource } from '../../config/database';
import { app } from '../../index';
import { DataSource } from 'typeorm';
const request = require("supertest");
const testCustomerId: string = "11141363-ddb8-47e4-9ee2-989c62e243ef";
describe('Customer Controller', () => {
    let dataSource: DataSource;
    let testCustomer: Customer;
    let testTransactions: Transaction[];

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        const customerRepository = dataSource.getRepository(Customer);
        const transactionRepository = dataSource.getRepository(Transaction);

        testCustomer = await customerRepository.save(
            customerRepository.create({
                id: testCustomerId,
                firstName: "Test",
                lastName: "User",
                documentId: "12345",
                documentType: "DNI"
            })
        );

        testTransactions = await transactionRepository.save([
            transactionRepository.create({
                customer: testCustomer,
                paidPrice: 100.00,
                tax: 21.00,
                relatedEventId: "11112322-ddb8-47e4-9eee-989c62e243ef"
            }),
            transactionRepository.create({
                customer: testCustomer,
                paidPrice: 200.00,
                tax: 42.00,
                relatedEventId: "11141363-ddb8-47e4-9eee-989c62e243ef"
            })
        ]);
    });

    afterEach(async () => {
        if (dataSource && dataSource.isInitialized) {
            const transactionRepository = dataSource.getRepository(Transaction);
            const customerRepository = dataSource.getRepository(Customer);

            if (testTransactions != undefined) {
                await transactionRepository.delete(
                    testTransactions.map(t => t.id)
                );
            }
            await customerRepository.delete(testCustomer.id);
        }
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    describe("GET /api/customers", () => {
        it("debe retornar la lista de clientes con sus transacciones", async () => {
            const res = await request(app)
                .get('/api/customers')
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);

            const foundCustomer = res.body.find((c: Customer) => c.id === testCustomer.id);
            expect(foundCustomer).toBeDefined();
            expect(foundCustomer.firstName).toBe("Test");
            expect(foundCustomer.lastName).toBe("User");
            expect(foundCustomer.documentId).toBe("12345");
            expect(Array.isArray(foundCustomer.transactions)).toBe(true);
            expect(foundCustomer.transactions.length).toBe(2);
        });

        it("debe manejar errores de base de datos", async () => {
            jest.spyOn(AppDataSource.getRepository(Customer), 'find')
                .mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .get('/api/customers')
                .expect(500);

            expect(res.body).toEqual({
                message: "Error fetching customers"
            });
        });
    });

    describe("GET /api/customers/transactions", () => {
        it("debe retornar las transacciones con datos del cliente", async () => {
            const res = await request(app)
                .get("/api/customers/transactions")
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);

            const transactions = res.body;
            expect(transactions.length).toBeGreaterThanOrEqual(2);
        });

        it('debe manejar errores en la consulta de transacciones', async () => {
            jest.spyOn(AppDataSource.getRepository(Transaction), 'createQueryBuilder')
                .mockImplementationOnce(() => {
                    throw new Error('Query error');
                });

            const res = await request(app)
                .get("/api/customers/transactions")
                .expect(500);

            expect(res.body).toEqual({
                message: "Error fetching customer transactions"
            });
        });

    });
});