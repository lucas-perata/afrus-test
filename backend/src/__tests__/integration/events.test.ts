import { Customer, CustomerEvent, EventType } from '@/entities';
import { AppDataSource } from '../../config/database';
import { app } from '../../index';
import { DataSource } from 'typeorm';
const request = require("supertest");

describe('POST /api/events', () => {
    let dataSource: DataSource;
    const testCustomerId: string = "11141363-ddb8-47e4-9eee-989c62e243ef";

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize();
        const customerRepository = dataSource.getRepository(Customer);
        
        const testCustomer: Customer = customerRepository.create({
            id: testCustomerId,
            firstName: "Test",
            lastName: "User",
            documentId: "TEST123",
            documentType: "DNI",
            createdAt: new Date()
        });
        
        await customerRepository.save(testCustomer);
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            const eventRepository = dataSource.getRepository(CustomerEvent);
            const customerRepository = dataSource.getRepository(Customer);
            
            await eventRepository.delete({ customer: { id: testCustomerId } });
            await customerRepository.delete({ id: testCustomerId });
            
            await dataSource.destroy();
        }
    });

    it("debe crear un evento del cliente exitosamente", async () => {
        const eventData = {
            customerId: testCustomerId,
            eventType: EventType.PURCHASE,
            eventData: { testKey: "testValue" },
            description: "Test event creation"
        };

        const res = await request(app)
            .post("/api/events")
            .send(eventData)
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.customer.id).toBe(testCustomerId);
        expect(res.body.eventType).toBe(EventType.PURCHASE);
        expect(res.body.description).toBe(eventData.description);
        expect(res.body.eventData).toEqual(eventData.eventData);
    });

    it("debe retornar 400 si faltan campos requeridos", async () => {
        const incompleteData = {
            customerId: testCustomerId
        };

        const res = await request(app)
            .post("/api/events")
            .send(incompleteData)
            .expect(400);

        expect(res.body).toEqual({ message: "Missing required fields" });
    });

    it("debe retornar 400 si el tipo de evento es inválido", async () => {
        const invalidEventData = {
            customerId: testCustomerId,
            eventType: 'INVALID_TYPE',
            eventData: { testKey: "testValue" },
            description: "Test invalid event type"
        };

        const res = await request(app)
            .post('/api/events')
            .send(invalidEventData)
            .expect(400);

        expect(res.body).toEqual({ message: "Invalid event type" });
    });

    it("debe retornar 404 si el cliente no existe", async () => {
        const nonExistentCustomerId = '99999999-9999-9999-9999-999999999999';
        const eventData = {
            customerId: nonExistentCustomerId,
            eventType: EventType.PURCHASE,
            eventData: { testKey: "testValue" },
            description: "Test non-existent customer"
        };

        const res = await request(app)
            .post("/api/events")
            .send(eventData)
            .expect(404);

        expect(res.body).toEqual({ message: "Customer not found" });
    });

    it("debe crear un evento sin description (campo opcional)", async () => {
        const eventData = {
            customerId: testCustomerId,
            eventType: EventType.VISIT,
            eventData: { testKey: "testValue" }
        };

        const res = await request(app)
            .post("/api/events")
            .send(eventData)
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.description).toBeNull();
    });

    it("debe crear un evento sin eventData (campo opcional)", async () => {
        const eventData = {
            customerId: testCustomerId,
            eventType: EventType.VISIT,
            description: "Test without eventData"
        };

        const res = await request(app)
            .post("/api/events")
            .send(eventData)
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.eventData).toBeNull();
    });
});