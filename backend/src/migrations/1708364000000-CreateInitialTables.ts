import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateInitialTables1708364000000 implements MigrationInterface {
    name = 'CreateInitialTables1708364000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum type for event types
        await queryRunner.query(`
            CREATE TYPE "event_type_enum" AS ENUM (
                'purchase', 'return', 'visit', 'data_query', 'data_update', 'invoice_download'
            )
        `)

        // Create products table
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "description" text NOT NULL,
                "price" decimal(10,2) NOT NULL,
                "stockQuantity" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP DEFAULT NULL
            )
        `)

        // Create customers table
        await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "documentId" varchar NOT NULL,
                "documentType" varchar NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `)

        // Create transactions table
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "customerId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "paidPrice" decimal(10,2) NOT NULL,
                "tax" decimal(10,2) NOT NULL,
                "transactionDate" TIMESTAMP NOT NULL DEFAULT now(),
                "relatedEventId" uuid NOT NULL,
                FOREIGN KEY ("customerId") REFERENCES "customers"("id"),
                FOREIGN KEY ("productId") REFERENCES "products"("id")
            )
        `)

        // Create customer_events table
        await queryRunner.query(`
            CREATE TABLE "customer_events" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "customerId" uuid NOT NULL,
                "eventType" event_type_enum NOT NULL,
                "eventData" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "description" varchar,
                FOREIGN KEY ("customerId") REFERENCES "customers"("id")
            )
        `)

        // Create indexes
        await queryRunner.query(`CREATE INDEX "IDX_products_name" ON "products"("name")`)
        await queryRunner.query(`CREATE INDEX "IDX_products_price" ON "products"("price")`)
        await queryRunner.query(`CREATE INDEX "IDX_products_stock" ON "products"("stockQuantity")`)
        await queryRunner.query(`CREATE INDEX "IDX_products_deleted" ON "products"("deletedAt")`)
        await queryRunner.query(`CREATE INDEX "IDX_customers_document" ON "customers"("documentId")`)
        await queryRunner.query(`CREATE INDEX "IDX_transactions_date" ON "transactions"("transactionDate")`)
        await queryRunner.query(`CREATE INDEX "IDX_customer_events_type" ON "customer_events"("eventType")`)
        await queryRunner.query(`CREATE INDEX "IDX_customer_events_date" ON "customer_events"("createdAt")`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_customer_events_date"`)
        await queryRunner.query(`DROP INDEX "IDX_customer_events_type"`)
        await queryRunner.query(`DROP INDEX "IDX_transactions_date"`)
        await queryRunner.query(`DROP INDEX "IDX_customers_document"`)
        await queryRunner.query(`DROP INDEX "IDX_products_deleted"`)
        await queryRunner.query(`DROP INDEX "IDX_products_stock"`)
        await queryRunner.query(`DROP INDEX "IDX_products_price"`)
        await queryRunner.query(`DROP INDEX "IDX_products_name"`)

        // Drop tables
        await queryRunner.query(`DROP TABLE "customer_events"`)
        await queryRunner.query(`DROP TABLE "transactions"`)
        await queryRunner.query(`DROP TABLE "customers"`)
        await queryRunner.query(`DROP TABLE "products"`)

        // Drop enum type
        await queryRunner.query(`DROP TYPE "event_type_enum"`)
    }
}