import { AppDataSource } from "../config/database"
import { Product } from "../entities/Product"
import { Customer } from "../entities/Customer"
import { Transaction } from "../entities/Transaction"
import { CustomerEvent, EventType } from "../entities/CustomerEvent"
import { faker } from "@faker-js/faker"

const NUM_PRODUCTS = 100
const NUM_CUSTOMERS = 1000
const NUM_TRANSACTIONS = 5000
const NUM_EVENTS = 10000

async function seedProducts() {
    const productRepository = AppDataSource.getRepository(Product)
    const products: Product[] = []

    for (let i = 0; i < NUM_PRODUCTS; i++) {
        const product = productRepository.create({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stockQuantity: faker.number.int({ min: 0, max: 100 })
        })
        products.push(product)
    }

    await productRepository.save(products)
    console.log(`✓ Created ${NUM_PRODUCTS} products`)
    return products
}

async function seedCustomers() {
    const customerRepository = AppDataSource.getRepository(Customer)
    const customers: Customer[] = []

    for (let i = 0; i < NUM_CUSTOMERS; i++) {
        const customer = customerRepository.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            documentId: faker.string.numeric(8),
            documentType: faker.helpers.arrayElement(['DNI', 'Passport', 'Foreign ID'])
        })
        customers.push(customer)
    }

    await customerRepository.save(customers)
    console.log(`✓ Created ${NUM_CUSTOMERS} customers`)
    return customers
}

async function seedEvents(customers: Customer[]) {
    const eventRepository = AppDataSource.getRepository(CustomerEvent)
    const events: CustomerEvent[] = []

    for (let i = 0; i < NUM_EVENTS; i++) {
        const customer = faker.helpers.arrayElement(customers)
        const eventType = faker.helpers.arrayElement(Object.values(EventType))
        
        const event = eventRepository.create({
            customer,
            eventType,
            description: faker.lorem.sentence(),
            eventData: {
                ip: faker.internet.ip(),
                userAgent: faker.internet.userAgent(),
                timestamp: faker.date.past().toISOString()
            }
        })
        events.push(event)
    }

    await eventRepository.save(events)
    console.log(`✓ Created ${NUM_EVENTS} events`)
    return events
}

async function seedTransactions(customers: Customer[], products: Product[], events: CustomerEvent[]) {
    const transactionRepository = AppDataSource.getRepository(Transaction)
    const transactions: Transaction[] = []

    for (let i = 0; i < NUM_TRANSACTIONS; i++) {
        const customer = faker.helpers.arrayElement(customers)
        const product = faker.helpers.arrayElement(products)
        
        const transaction = transactionRepository.create({
            customer,
            product,
            paidPrice: parseFloat(faker.commerce.price()),
            tax: parseFloat((faker.number.float({ min: 0.1, max: 0.21 }) * product.price).toFixed(2)),
            relatedEventId: faker.string.uuid() 
        })
        transactions.push(transaction)
    }

    await transactionRepository.save(transactions)
    console.log(`✓ Created ${NUM_TRANSACTIONS} transactions`)
}

async function main() {
    try {
        console.log("🌱 Starting database seeding...")
        
        await AppDataSource.initialize()
        console.log("✓ Database connected")

        await AppDataSource.synchronize(true)
        console.log("✓ Database cleaned")

        const products = await seedProducts()
        const customers = await seedCustomers()
        const events = await seedEvents(customers)
        await seedTransactions(customers, products, events)

        console.log("✅ Database seeding completed!")
        process.exit(0)
    } catch (error) {
        console.error("Error seeding database:", error)
        process.exit(1)
    }
}

main()