import { Product, Transaction } from '@/entities';
import { AppDataSource } from '../../config/database';
import { app } from '../../index';
import { DataSource } from 'typeorm';
const request = require("supertest");

describe("Product Controller", () => {
    let dataSource: DataSource;
    let createdProductIds: string[] = [];

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize();
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            const transactionRepository = dataSource.getRepository(Transaction);
            const productRepository = dataSource.getRepository(Product);

            await transactionRepository
                .createQueryBuilder()
                .delete()
                .where("productId IN (:...ids)", { ids: createdProductIds })
                .execute();

            await productRepository
                .createQueryBuilder()
                .delete()
                .where("id IN (:...ids)", { ids: createdProductIds })
                .execute();

            await dataSource.destroy();
        }
    });

    describe("GET /api/products/filter/price-stock", () => {
        it("debe retornar productos filtrados por precio y stock", async () => {
            const productRepository = dataSource.getRepository(Product);
            
            const productsToCreate = [
                {
                    name: "Expensive Low Stock",
                    description: "Should appear in filter",
                    price: 51,
                    stockQuantity: 19
                },
                {
                    name: "Cheap High Stock",
                    description: "Should not appear in filter",
                    price: 49,
                    stockQuantity: 21
                }
            ];

            const savedProducts = await productRepository.save(
                productsToCreate.map(p => productRepository.create(p))
            );
            createdProductIds = savedProducts.map(p => p.id);

            const res = await request(app)
                .get("/api/products/filter/price-stock")
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            const filteredProducts = res.body;
            
            filteredProducts.forEach((product: Product) => {
                expect(product.stockQuantity).toBeLessThan(20);
                expect(Number(product.price)).toBeGreaterThan(50);
            });
        });

        it("no debe incluir productos eliminados en el filtro", async () => {
            const productRepository = dataSource.getRepository(Product);
            
            const product = await productRepository.save(
                productRepository.create({
                    name: "Deleted Filtered Product",
                    description: "Should not appear in filter",
                    price: 55,
                    stockQuantity: 15
                })
            );
            
            createdProductIds.push(product.id);
            
            await productRepository.softRemove(product);

            const res = await request(app)
                .get("/api/products/filter/price-stock")
                .expect(200);

            const deletedProductFound = res.body.find(
                (p: Product) => p.id === product.id
            );
            expect(deletedProductFound).toBeUndefined();
        });
    });
});