import { DataSource } from "typeorm"
import { config } from "dotenv"
import path from "path"

config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "afrus_test",
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, "../entities/*{.ts,.js}")],
    migrations: [path.join(__dirname, "../migrations/*{.ts,.js}")],
    subscribers: [],
})